package com.sjprogramming.restapi.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sjprogramming.restapi.entity.Agent;
import com.sjprogramming.restapi.entity.PlanningGarde;
import com.sjprogramming.restapi.entity.ResourceNotFoundException;
import com.sjprogramming.restapi.entity.Secretaire;
import com.sjprogramming.restapi.entity.ServiceEntity;
import com.sjprogramming.restapi.repository.AgentRepository;
import com.sjprogramming.restapi.repository.PlanningGardeRepository;
import com.sjprogramming.restapi.repository.SecretaireRepository;
import com.sjprogramming.restapi.repository.ServiceRepository;

@Service
public class PlanningGardeService {
@Autowired
private ServiceRepository serviceRepository;
    @Autowired
    private AgentRepository agentRepository;
    @Autowired
    private SecretaireRepository secretaireRepository;
    @Autowired
    private PlanningGardeRepository planningGardeRepository;
    @Autowired
    private EmailService emailService;


    private int lastIndex = 0; // Dernier index utilisé pour la sélection

    // Méthode pour obtenir les agents disponibles pour un service
    private List<Agent> getAvailableAgents(Long serviceId) {
        // Supposons que vous avez une méthode pour obtenir les agents par service
        List<Agent> agents = agentRepository.findByServiceId(serviceId);
        // Filtrer les agents en fonction de leur disponibilité (exemple)
        // agents = agents.stream().filter(Agent::isAvailable).collect(Collectors.toList());
        return agents;
    }

    // Méthode pour sélectionner deux agents de manière cyclique
 // Méthode pour sélectionner un agent de manière cyclique
    public Agent selectAgentForPlanning(Long serviceId) {
        List<Agent> agents = getAvailableAgents(serviceId);
        if (agents.isEmpty()) {
            throw new IllegalArgumentException("No available agents to select.");
        }

        // Calculer l'index pour la sélection cyclique
        int numAgents = agents.size();
        int selectedIndex = lastIndex % numAgents;

        // Mettre à jour l'index pour la prochaine sélection
        lastIndex = (lastIndex + 1) % numAgents;

        return agents.get(selectedIndex);
    }

    public PlanningGarde createPlanningGarde(Long serviceId, LocalDate date) {
        // Charger complètement le service à partir du repository
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid service ID"));

        Agent selectedAgent = selectAgentForPlanning(serviceId);

        PlanningGarde planningGarde = new PlanningGarde();
        planningGarde.setService(service); // Assigner l'entité service complète
        planningGarde.setDate(date);
        planningGarde.setAgents(List.of(selectedAgent)); // Assigner un seul agent
        return planningGardeRepository.save(planningGarde);
    }


    public List<PlanningGarde> getPlanningGardes(ServiceEntity service) {
        return planningGardeRepository.findByServiceAndDate(service, LocalDate.now());
    }

 public PlanningGarde createPlanningGarde(PlanningGarde planningGarde) {
        if (planningGarde.getService() == null || planningGarde.getService().getId() == null) {
            throw new IllegalArgumentException("Service ID must not be null");
        }

        // Assurez-vous que toutes les données sont valides avant de les enregistrer
        return planningGardeRepository.save(planningGarde);
    }
 public PlanningGarde getPlanningGardeById(Long planningId) {
	    return planningGardeRepository.findById(planningId).orElse(null);
	}
 
 
 
 
 public List<String> getAgentEmailsByIds(List<Long> agentIds) {
	    List<Agent> agents = agentRepository.findAllById(agentIds);
	    return agents.stream()
	                 .map(Agent::getEmail) // Ensure Agent has a getEmail() method
	                 .collect(Collectors.toList());
	}

 
 
 public PlanningGarde createPlanningGardeWithSpecificAgents(Long serviceId, LocalDate date, List<Long> agentIds) {
	    ServiceEntity service = serviceRepository.findById(serviceId)
	            .orElseThrow(() -> new IllegalArgumentException("Invalid service ID"));
	    
	    List<Agent> selectedAgents = agentRepository.findAllById(agentIds);
	    if (selectedAgents.size() < 1) {
	        throw new IllegalArgumentException("At least two agents must be specified.");
	    }

	    PlanningGarde planningGarde = new PlanningGarde();
	    planningGarde.setService(service);
	    planningGarde.setDate(date);
	    planningGarde.setAgents(selectedAgents);

	    return planningGardeRepository.save(planningGarde);
	}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 public PlanningGarde getLatestPlanningGarde(Long serviceId) {
	    // Charger complètement le service à partir du repository
	    ServiceEntity service = serviceRepository.findById(serviceId)
	            .orElseThrow(() -> new IllegalArgumentException("Invalid service ID"));

	    // Récupérer le dernier planning créé pour ce service
	    return planningGardeRepository.findTopByServiceOrderByDateDesc(service);
	}

 
 
 
 
 public Map<ServiceEntity, PlanningGarde> getLatestPlanningGardesForAllServices() {
     List<ServiceEntity> services = serviceRepository.findAll();
     Map<ServiceEntity, PlanningGarde> latestPlannings = new HashMap<>();

     for (ServiceEntity service : services) {
         List<PlanningGarde> plannings = planningGardeRepository.findLatestByServiceOrderByDateDesc(service);
         if (!plannings.isEmpty()) {
             latestPlannings.put(service, plannings.get(0)); // Add the most recent planning garde
         }
     }

     return latestPlannings;
 }

 
 
 
 
 
 // Méthode pour obtenir les agents disponibles d'un service spécifique
 private List<Agent> getAvailableAgentsForSecretaire(Long secretaireId) {
     Secretaire secretaire = secretaireRepository.findById(secretaireId)
         .orElseThrow(() -> new ResourceNotFoundException("Secretaire not found"));
     Long serviceId = secretaire.getService().getId();
     return getAvailableAgents(serviceId);
 }

 
 
 
 
 
 
 
 
 
 
 
 public PlanningGarde createManualPlanningGarde(Long secretaireId, LocalDate date, List<Long> agentIds) {
	    Secretaire secretaire = secretaireRepository.findById(secretaireId)
	            .orElseThrow(() -> new IllegalArgumentException("Invalid secretary ID"));

	    ServiceEntity service = secretaire.getService();

	    // Vérifiez si les agents appartiennent au service de la secrétaire
	    List<Agent> selectedAgents = agentRepository.findAllById(agentIds);
	    if (selectedAgents.size() != agentIds.size() || selectedAgents.stream().anyMatch(agent -> !agent.getService().equals(service))) {
	        throw new IllegalArgumentException("All selected agents must belong to the same service as the secretary.");
	    }

	    PlanningGarde planningGarde = new PlanningGarde();
	    planningGarde.setService(service);
	    planningGarde.setDate(date);
	    planningGarde.setAgents(selectedAgents);

	    return planningGardeRepository.save(planningGarde);
	}
 public PlanningGarde createManualPlanningGardee(Long secretaireId, LocalDate date, List<Long> agentIds) {
	    // Obtenez le service du secrétaire
	    ServiceEntity service = secretaireRepository.findById(secretaireId)
	        .orElseThrow(() -> new RuntimeException("Secretaire not found")).getService();
	    
	    // Créez un PlanningGarde et associez-le au service
	    PlanningGarde planningGarde = new PlanningGarde();
	    planningGarde.setDate(date);
	    planningGarde.setService(service);

	    // Ajoutez les agents au planning
	    List<Agent> agents = agentRepository.findAllById(agentIds);
	    planningGarde.setAgents(agents);
	    
	    // Sauvegardez le planning
	    return planningGardeRepository.save(planningGarde);
	}

 
 
 
 
 
 
 
 // Un champ pour stocker l'index de l'agent sélectionné en dernier, temporairement en mémoire
 private final Map<Long, Integer> lastSelectedAgentIndexMap = new HashMap<>();

 // Méthode pour récupérer l'index du dernier agent sélectionné pour un service donné
 public int getLastSelectedAgentIndex(ServiceEntity service) {
     // Si aucun index n'a été enregistré pour ce service, on commence à zéro
     return lastSelectedAgentIndexMap.getOrDefault(service.getId(), -1);
 }
 public void updateLastSelectedAgentIndex(ServiceEntity service, int newIndex) {
     lastSelectedAgentIndexMap.put(service.getId(), newIndex);
 }

 
 public List<PlanningGarde> getAllPlannings() {
	    return planningGardeRepository.findAll();
	}
 public boolean deletePlanningGarde(Long planningId) {
	    try {
	        planningGardeRepository.deleteById(planningId);
	        return true;
	    } catch (Exception e) {
	        // Gérer l'exception ou logger l'erreur
	        return false;
	    }
	}


} 