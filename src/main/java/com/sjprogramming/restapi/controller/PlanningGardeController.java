package com.sjprogramming.restapi.controller;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sjprogramming.restapi.entity.Agent;
import com.sjprogramming.restapi.entity.PlanningGarde;
import com.sjprogramming.restapi.entity.PlanningGardeRequest;
import com.sjprogramming.restapi.entity.ServiceEntity;
import com.sjprogramming.restapi.repository.AgentRepository;
import com.sjprogramming.restapi.service.EmailService;
import com.sjprogramming.restapi.service.PlanningGardeService;
import com.sjprogramming.restapi.service.SecretaireService;

@RestController
@RequestMapping("/api/plannings")
public class PlanningGardeController {

    @Autowired
    private PlanningGardeService planningGardeService;
    @Autowired
    private SecretaireService secretaireService;
    @Autowired
    private AgentRepository agentRepository;
    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<PlanningGarde> createPlanningGarde(@RequestBody PlanningGarde planningGarde) {
        if (planningGarde.getService() == null || planningGarde.getService().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        PlanningGarde createdPlanningGarde = planningGardeService.createPlanningGarde(planningGarde);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlanningGarde);
    }
    @GetMapping("/all")
    public ResponseEntity<List<PlanningGarde>> getAllPlannings() {
        List<PlanningGarde> allPlannings = planningGardeService.getAllPlannings();
        if (allPlannings.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(allPlannings);
    }


    @GetMapping("/{serviceId}")
    public ResponseEntity<List<PlanningGarde>> getPlanningGardes(@PathVariable Long serviceId) {
        ServiceEntity service = new ServiceEntity();
        service.setId(serviceId);
        List<PlanningGarde> plannings = planningGardeService.getPlanningGardes(service);
        if (plannings.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(plannings);
    }
    
    @PostMapping("/creat")
    public ResponseEntity<PlanningGarde> createAutomaticPlanning(
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            PlanningGarde planningGarde = planningGardeService.createPlanningGarde(serviceId, date);
            return ResponseEntity.status(HttpStatus.CREATED).body(planningGarde);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping("/create")
    public ResponseEntity<PlanningGarde> createzeAutomaticPlanning(
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            PlanningGarde planningGarde = planningGardeService.createPlanningGarde(serviceId, date);
            return ResponseEntity.ok(planningGarde);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/planid/{planningId}")
    public ResponseEntity<PlanningGarde> getPlanningGardeById(@PathVariable Long planningId) {
        PlanningGarde planningGarde = planningGardeService.getPlanningGardeById(planningId);
        if (planningGarde == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(planningGarde);
    }

    @PostMapping("/manual")
    public ResponseEntity<PlanningGarde> createManualPlanningGarde(@RequestBody PlanningGardeRequest request) {
        try {
            // Create the PlanningGarde
            PlanningGarde createdPlanningGarde = planningGardeService.createPlanningGardeWithSpecificAgents(
                request.getServiceId(),
                request.getDate(),
                request.getAgentIds()
            );

            // Log details
            System.out.println("PlanningGarde: " + createdPlanningGarde);
            System.out.println("Service: " + createdPlanningGarde.getService());
            System.out.println("Service Name: " + createdPlanningGarde.getService().getNom());

            // Fetch the agent emails based on agent IDs
            List<String> agentEmails = planningGardeService.getAgentEmailsByIds(request.getAgentIds());

            // Prepare and send email notifications to each agent
            String subject = "New Planning Garde Created";
            String text = "Vous avez été choisi pour être de garde le " + request.getDate() + 
                          " pour le service: " + createdPlanningGarde.getService().getNom();

            for (String email : agentEmails) {
                emailService.sendEmail(email, subject, text);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlanningGarde);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }



    
    
    
    
    
    
    
    @GetMapping("/latest/{serviceId}")
    public ResponseEntity<PlanningGarde> getLatestPlanningGarde(@PathVariable Long serviceId) {
        try {
            PlanningGarde latestPlanningGarde = planningGardeService.getLatestPlanningGarde(serviceId);
            if (latestPlanningGarde == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(latestPlanningGarde);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    
 // Assurez-vous que la méthode getLatestPlanningGardesForAllServices() renvoie bien une Map<String, PlanningGarde>
    @GetMapping("/latest")
    public Map<String, PlanningGarde> getLatestPlannings() {
        Map<String, PlanningGarde> latestPlannings = new HashMap<>();
        
        for (Map.Entry<ServiceEntity, PlanningGarde> entry : planningGardeService.getLatestPlanningGardesForAllServices().entrySet()) {
            PlanningGarde planningGarde = entry.getValue();
            latestPlannings.put(entry.getKey().toString(), planningGarde);
            
            // You can remove the email notification block entirely
            /*
            if (!planningGarde.getAgents().isEmpty()) {
                Agent assignedAgent = planningGarde.getAgents().get(0);
                String subject = "Notification de garde";
                String text = "Bonjour " + assignedAgent.getNom() + ",\n\nVous avez été assigné à la garde le " + planningGarde.getDate() + ".\n\nMerci.";
                emailService.sendEmail(assignedAgent.getEmail(), subject, text);
            }
            */
        }
        return latestPlannings;
    }


    
    @PostMapping("/manual/{secretaireId}")
    public ResponseEntity<String> createManualPlanningGardee(
            @PathVariable Long secretaireId,
            @RequestBody PlanningGardeRequest request) {
        try {
            // Récupérer le service associé au secrétaire
            ServiceEntity service = secretaireService.getServiceBySecretaireId(secretaireId);

            // Vérifier que tous les agents appartiennent au même service
            for (Long agentId : request.getAgentIds()) {
                Agent agent = agentRepository.findById(agentId)
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
                if (!agent.getService().equals(service)) {
                    return ResponseEntity.badRequest().body("Les agents ne sont pas tous dans le même service.");
                }
            }

            // Créer le planning de garde
            PlanningGarde createdPlanningGarde = planningGardeService.createManualPlanningGardee(secretaireId, request.getDate(), request.getAgentIds());

            // Fetch the agent emails based on agent IDs
            List<String> agentEmails = planningGardeService.getAgentEmailsByIds(request.getAgentIds());

            // Prepare the email notification
            String subject = "Nouvelle Garde Assignée";
            String text = "Vous avez été choisi pour être de garde le " + request.getDate() +
                          " pour le service: " + service.getNom();

            // Send email notifications to each agent
            for (String email : agentEmails) {
                emailService.sendEmail(email, subject, text);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body("Planning de garde créé avec succès.");
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Argument illégal : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur : " + e.getMessage());
        }
    }


    @PostMapping("/auto/{secretaireId}")
    public ResponseEntity<String> createAutoPlanningGarde(
            @PathVariable Long secretaireId,
            @RequestBody PlanningGardeRequest request) {
        try {
            // Récupérer le service associé au secrétaire
            ServiceEntity service = secretaireService.getServiceBySecretaireId(secretaireId);
            
            // Récupérer les agents du service
            List<Agent> agents = agentRepository.findByService(service);

            // Vérifier qu'il y a au moins un agent
            if (agents.isEmpty()) {
                return ResponseEntity.badRequest().body("Aucun agent disponible dans le service.");
            }

            // Récupérer l'index du dernier agent sélectionné pour ce service
            int lastSelectedIndex = planningGardeService.getLastSelectedAgentIndex(service);

            // Sélectionner l'agent suivant dans la liste de manière cyclique
            int nextAgentIndex = (lastSelectedIndex + 1) % agents.size();
            Agent selectedAgent = agents.get(nextAgentIndex);

            // Créer le planning de garde pour l'agent sélectionné
            PlanningGarde createdPlanningGarde = planningGardeService.createManualPlanningGardee(
                secretaireId, request.getDate(), Arrays.asList(selectedAgent.getId()));

            // Mettre à jour l'index du dernier agent sélectionné
            planningGardeService.updateLastSelectedAgentIndex(service, nextAgentIndex);

            // Prepare and send email notification to the selected agent
            String subject = "Nouvelle Garde Assignée";
            String text = "Vous avez été choisi pour être de garde le " + request.getDate() +
                          " pour le service: " + service.getNom();

            emailService.sendEmail(selectedAgent.getEmail(), subject, text);

            return ResponseEntity.status(HttpStatus.CREATED).body("Planning de garde créé automatiquement pour " + selectedAgent.getNom() + ".");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur : " + e.getMessage());
        }
    }

    @DeleteMapping("/{planningId}")
    public ResponseEntity<Void> deletePlanningGarde(@PathVariable Long planningId) {
        try {
            boolean deleted = planningGardeService.deletePlanningGarde(planningId);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




}