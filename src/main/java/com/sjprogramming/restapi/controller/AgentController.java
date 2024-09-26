package com.sjprogramming.restapi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sjprogramming.restapi.entity.Agent;
import com.sjprogramming.restapi.service.AgentService;
import com.sjprogramming.restapi.service.EmailService;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
    
    @Autowired
    private AgentService agentService;
    @Autowired
    private EmailService emailService;
    @GetMapping
    public ResponseEntity<List<Agent>> getAllAgents() {
        List<Agent> agents = agentService.getAllAgents();
        return ResponseEntity.ok(agents);
    }

    @PostMapping
    public ResponseEntity<?> createAgent(@RequestBody Agent agent) {
        try {
            Agent createdAgent = agentService.createAgent(agent);
            
            // Send email notification
            String subject = "Agent Created";
            String text = "Un agent a été créé avec cet email appelé: " + createdAgent.getNom();
            emailService.sendEmail(agent.getEmail(), subject, text); // Assuming the agent has an email field
            
            return ResponseEntity.ok(createdAgent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgentsecretaire(@PathVariable Long id, @RequestBody Agent agentDetails) {
        // Récupérer l'agent existant
        Agent existingAgent = agentService.getAgentById(id);
        
        // Vérifier si l'agent existe
        if (existingAgent == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Récupérer l'email existant et le nouvel email
        String oldEmail = existingAgent.getEmail();
        String newEmail = agentDetails.getEmail();
        
        // Vérifier si le nouvel email existe déjà (sauf s'il s'agit de l'email actuel)
        if (newEmail != null && !newEmail.isEmpty() && !newEmail.equals(oldEmail)) {
            if (agentService.emailExists(newEmail)) {
                return ResponseEntity.badRequest().body("Cet email est déjà utilisé par un autre agent.");
            }
        }

        // Mettre à jour l'agent
        Agent updatedAgent = agentService.updateAgentSecretaire(id, agentDetails);
        
        // Si l'email a changé, envoyer un email à l'ancienne et au nouveau
        if (oldEmail != null && !oldEmail.equals(newEmail) && newEmail != null && !newEmail.isEmpty()) {
            // Envoyer un email à l'ancienne adresse
            String subjectOld = "Email Address Updated";
            String textOld = "Votre adresse email a été mise à jour. Votre ancienne adresse était : " + oldEmail;
            emailService.sendEmail(oldEmail, subjectOld, textOld);
            
            // Envoyer un email à la nouvelle adresse
            String subjectNew = "Email Address Updated";
            String textNew = "Votre adresse email a été mise à jour avec succès.";
            emailService.sendEmail(newEmail, subjectNew, textNew);
        }
        
        return ResponseEntity.ok(updatedAgent);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateAgentAdmin(@PathVariable Long id, @RequestBody Agent agentDetails) {
        // Récupérer l'agent existant
        Agent existingAgent = agentService.getAgentById(id);
        
        // Vérifier si l'agent existe
        if (existingAgent == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Récupérer l'email existant et le nouvel email
        String oldEmail = existingAgent.getEmail();
        String newEmail = agentDetails.getEmail();
        
        // Vérifier si le nouvel email existe déjà (sauf s'il s'agit de l'email actuel)
        if (newEmail != null && !newEmail.isEmpty() && !newEmail.equals(oldEmail)) {
            if (agentService.emailExists(newEmail)) {
                return ResponseEntity.badRequest().body("Cet email est déjà utilisé par un autre agent.");
            }
        }

        // Mettre à jour l'agent
        Agent updatedAgent = agentService.updateAgentAdmin(id, agentDetails);
        
        // Si l'email a changé, envoyer un email à l'ancienne et au nouveau
        if (oldEmail != null && !oldEmail.equals(newEmail) && newEmail != null && !newEmail.isEmpty()) {
            // Envoyer un email à l'ancienne adresse
            String subjectOld = "Email Address Updated";
            String textOld = "Votre adresse email a été mise à jour. Votre ancienne adresse était : " + oldEmail;
            emailService.sendEmail(oldEmail, subjectOld, textOld);
            
            // Envoyer un email à la nouvelle adresse
            String subjectNew = "Email Address Updated";
            String textNew = "Votre adresse email a été mise à jour avec succès.";
            emailService.sendEmail(newEmail, subjectNew, textNew);
        }
        
        return ResponseEntity.ok(updatedAgent);
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteAgent(@PathVariable Long id) {
        try {
            Map<String, Boolean> response = agentService.deleteAgent(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Agent>> getAgentsByService(@PathVariable Long serviceId) {
        List<Agent> agents = agentService.getAgentsByService(serviceId);
        if (agents.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgentById(@PathVariable Long id) {
        Agent agent = agentService.getAgentById(id);
        if (agent != null) {
            return ResponseEntity.ok(agent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/service/{serviceId}")
    public ResponseEntity<Agent> createAgentForService(@PathVariable Long serviceId, @RequestBody Agent agent) {
        Agent createdAgent = agentService.createAgentForService(serviceId, agent);
        
        // Envoi d'email
        String subject = "Agent Created";
        String text = "Un agent a été créé avec le nom: " + createdAgent.getNom();
        
        // Assurez-vous que l'email est valide avant d'envoyer
        if (createdAgent.getEmail() != null && !createdAgent.getEmail().isEmpty()) {
            emailService.sendEmail(createdAgent.getEmail(), subject, text);
        }

        return ResponseEntity.ok(createdAgent);
    }
    
    

}
