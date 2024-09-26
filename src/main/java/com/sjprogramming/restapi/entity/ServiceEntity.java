package com.sjprogramming.restapi.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String sa;      // New attribute
    private String site;   // New attribute
    private String sigle;  // New attribute

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("service")
    private List<Secretaire> secretaires;
   
    
    
    @OneToMany(mappedBy = "service", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties("service")
    private List<PlanningGarde> planningGardes; // Relationship with PlanningGarde

    @JsonIgnoreProperties({"service"})
    @OneToMany(mappedBy = "service", cascade = CascadeType.REMOVE)
    private List<Agent> agents;

    // Constructors
    public ServiceEntity() {}

    public ServiceEntity(Long id) {
        this.id = id;
    }

    public ServiceEntity(Long id, String nom) {
        this.id = id;
        this.nom = nom;
    }

    public ServiceEntity(Long id, String nom, List<Secretaire> secretaires) {
        this.id = id;
        this.nom = nom;
        this.secretaires = secretaires;
    }

    public ServiceEntity(Long id, String nom, List<Secretaire> secretaires, List<Agent> agents) {
        this.id = id;
        this.nom = nom;
        this.secretaires = secretaires;
        this.agents = agents;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getSa() {
        return sa;
    }

    public void setSa(String sa) {
        this.sa = sa;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getSigle() {
        return sigle;
    }

    public void setSigle(String sigle) {
        this.sigle = sigle;
    }

    public List<Secretaire> getSecretaires() {
        return secretaires;
    }

    public void setSecretaires(List<Secretaire> secretaires) {
        this.secretaires = secretaires;
    }

    public List<Agent> getAgents() {
        return agents;
    }

    public void setAgents(List<Agent> agents) {
        this.agents = agents;
    }
}
