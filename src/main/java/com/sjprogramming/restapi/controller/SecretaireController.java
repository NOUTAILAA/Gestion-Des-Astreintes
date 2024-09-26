package com.sjprogramming.restapi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.sjprogramming.restapi.entity.Secretaire;
import com.sjprogramming.restapi.repository.AgentRepository;
import com.sjprogramming.restapi.repository.SecretaireRepository;
import com.sjprogramming.restapi.service.SecretaireService;

@RestController
@RequestMapping("/api/secretaires")
public class SecretaireController {
    @Autowired
    private SecretaireService secretaireService;
@Autowired
private SecretaireRepository secretaireRepository;
@Autowired
private AgentRepository agentRepository;
    @GetMapping
    public List<Secretaire> getAllSecretaires() {
        return secretaireService.getAllSecretaires();
    }

    @PostMapping
    public Secretaire createSecretaire(@RequestBody Secretaire secretaire) {
        return secretaireService.createSecretaire(secretaire);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Secretaire> updateSecretaire(@PathVariable Long id, @RequestBody Secretaire secretaireDetails) {
        Secretaire updatedSecretaire = secretaireService.updateSecretaire(id, secretaireDetails);
        return ResponseEntity.ok(updatedSecretaire);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteSecretaire(@PathVariable Long id) {
        return secretaireService.deleteSecretaire(id);
    }
    @PostMapping("/login")
    public ResponseEntity<Secretaire> login(@RequestBody Map<String, String> credentials) {
        String cin = credentials.get("cin");
        String mdp = credentials.get("mdp");
        
        Secretaire secretaire = secretaireService.login(cin, mdp);
        if (secretaire != null) {
            return ResponseEntity.ok(secretaire);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

 //pour avoir les agents qui appartient aux meme service que secretaire .
    @GetMapping("/{id}/agents")
    public List<Agent> getAgentsBySecretaireId(@PathVariable Long id) {
        return secretaireService.getAgentsBySecretaireId(id);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Secretaire> getSecretaireById(@PathVariable Long id) {
        Secretaire secretaire = secretaireService.getSecretaireById(id);
        if (secretaire != null) {
            return ResponseEntity.ok(secretaire);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
