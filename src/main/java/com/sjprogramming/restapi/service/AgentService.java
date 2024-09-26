package com.sjprogramming.restapi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sjprogramming.restapi.entity.Agent;
import com.sjprogramming.restapi.entity.PlanningGarde;
import com.sjprogramming.restapi.entity.ResourceNotFoundException;
import com.sjprogramming.restapi.entity.ServiceEntity;
import com.sjprogramming.restapi.repository.AgentRepository;
import com.sjprogramming.restapi.repository.PlanningGardeRepository;
import com.sjprogramming.restapi.repository.ServiceRepository;

@Service
public class AgentService {
    @Autowired
    private AgentRepository agentRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private EmailService emailService; // Inject your email service

    @Autowired
    
private PlanningGardeRepository planningGardeRepository;
    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Agent createAgent(Agent agent) {
        if (agentRepository.existsByEmail(agent.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return agentRepository.save(agent);
    }
    public boolean emailExists(String email) {
        // Check if an agent with the given email exists
        return agentRepository.findByEmail(email).isPresent();
    }

//pour secretaire ne peut pas changer service . a refaire ceci .
    public Agent updateAgentSecretaire(Long id, Agent agentDetails) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agent not found for this id :: " + id));
        // Ne pas modifier le service ici
        agent.setCin(agentDetails.getCin());
        agent.setNom(agentDetails.getNom());
        agent.setAdresse(agentDetails.getAdresse());
        agent.setTelephone(agentDetails.getTelephone());
        agent.setEmail(agentDetails.getEmail()); // Mettre à jour l'email

        agent.setMdp(agentDetails.getMdp());

        return agentRepository.save(agent);
    }

  //pour secretaire ne peut pas changer service . a refaire ceci .
    public Agent updateAgentAdmin(Long id, Agent agentDetails) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agent not found for this id :: " + id));
        agent.setCin(agentDetails.getCin());
        agent.setNom(agentDetails.getNom());
        agent.setAdresse(agentDetails.getAdresse());
        agent.setTelephone(agentDetails.getTelephone());
        agent.setEmail(agentDetails.getEmail()); // Mettre à jour l'email

        agent.setMdp(agentDetails.getMdp());

        if (agentDetails.getService() != null) {
            Long serviceId = agentDetails.getService().getId();
            ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found for this id :: " + serviceId));
            agent.setService(service);
        }

        return agentRepository.save(agent);
    }



    public List<Agent> getAgentsByService(Long serviceId) {
        return agentRepository.findByServiceId(serviceId);
    }
    public Agent getAgentById(Long id) {
        return agentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agent not found with id " + id));
    }
    public Map<String, Boolean> deleteAgent(Long id) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agent not found for this id :: " + id));

        // Find the most recent planning garde for this agent
        List<PlanningGarde> plannings = planningGardeRepository.findTopByAgentIdOrderByDateDesc(id);
        if (!plannings.isEmpty()) {
            PlanningGarde latestPlanningGarde = plannings.get(0); // Get the most recent planning garde
            List<Agent> agents = latestPlanningGarde.getAgents();
            agents.remove(agent);
            latestPlanningGarde.setAgents(agents);
            planningGardeRepository.save(latestPlanningGarde);
        }

        agentRepository.delete(agent);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
    
    
    
    public Agent createAgentForService(Long serviceId, Agent agent) {
        // Check if the service exists
        ServiceEntity service = serviceRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found for this id :: " + serviceId));
        
        // Check if the email already exists
        if (agentRepository.findByEmail(agent.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        // Set the service
        agent.setService(service);
        
        // Save the agent
        Agent createdAgent = agentRepository.save(agent);

        // Send email notification
        String subject = "Agent Created";
        String text = "An agent has been created with the name: " + createdAgent.getNom();
        
        // Check if the email is valid before sending
        if (createdAgent.getEmail() != null && !createdAgent.getEmail().isEmpty()) {
            emailService.sendEmail(createdAgent.getEmail(), subject, text);
        }

        return createdAgent;
    }




}