package com.sjprogramming.restapi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sjprogramming.restapi.entity.Agent;
import com.sjprogramming.restapi.entity.ResourceNotFoundException;
import com.sjprogramming.restapi.entity.Secretaire;
import com.sjprogramming.restapi.entity.ServiceEntity;
import com.sjprogramming.restapi.repository.AgentRepository;
import com.sjprogramming.restapi.repository.SecretaireRepository;

@Service
public class SecretaireService {
    @Autowired
    private SecretaireRepository secretaireRepository;

    @Autowired
    private AgentRepository agentRepository;

    public List<Secretaire> getAllSecretaires() {
        return secretaireRepository.findAll();
    }

    public Secretaire createSecretaire(Secretaire secretaire) {
        return secretaireRepository.save(secretaire);
    }

    public Secretaire updateSecretaire(Long id, Secretaire secretaireDetails) {
        Secretaire secretaire = secretaireRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Secretaire not found for this id :: " + id));
        secretaire.setCin(secretaireDetails.getCin());
        secretaire.setNom(secretaireDetails.getNom());
        secretaire.setAdresse(secretaireDetails.getAdresse());
        secretaire.setTelephone(secretaireDetails.getTelephone());
        secretaire.setMdp(secretaireDetails.getMdp());
        secretaire.setService(secretaireDetails.getService());
        return secretaireRepository.save(secretaire);
    }

    public Map<String, Boolean> deleteSecretaire(Long id) {
        Secretaire secretaire = secretaireRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Secretaire not found for this id :: " + id));
        secretaireRepository.delete(secretaire);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
    public Secretaire login(String cin, String mdp) {
        return secretaireRepository.findByCinAndMdp(cin, mdp);
    }

    public List<Agent> getAgentsBySecretaireId(Long secretaireId) {
        Secretaire secretaire = secretaireRepository.findById(secretaireId)
            .orElseThrow(() -> new ResourceNotFoundException("Secretaire not found for this id :: " + secretaireId));
        
        ServiceEntity service = secretaire.getService();
        if (service == null) {
            throw new ResourceNotFoundException("Service not found for this secrétaire.");
        }
        
        return agentRepository.findByServiceId(service.getId());
    }
    
    
    public ServiceEntity getServiceBySecretaireId(Long secretaireId) {
        Secretaire secretaire = secretaireRepository.findById(secretaireId)
            .orElseThrow(() -> new RuntimeException("Secretaire not found"));
        return secretaire.getService();
    }
    public Secretaire getSecretaireById(Long id) {
        return secretaireRepository.findById(id).orElse(null);
    }

}
