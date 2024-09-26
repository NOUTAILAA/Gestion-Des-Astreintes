package com.sjprogramming.restapi.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cin;
    private String nom;
    private String adresse;
    private String telephone;
    private String mdp;
    private String email; // Nouveau champ pour l'email

    // getters et setters pour l'email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
 


	public Agent(Long id, String cin, String nom, String adresse, String telephone, String mdp, String email,
			List<PlanningGarde> plannings, ServiceEntity service) {
		super();
		this.id = id;
		this.cin = cin;
		this.nom = nom;
		this.adresse = adresse;
		this.telephone = telephone;
		this.mdp = mdp;
		this.email = email;
		this.plannings = plannings;
		this.service = service;
	}

	public Agent(Long id, String cin, String nom, String adresse, String telephone, String mdp,
			 ServiceEntity service) {
		super();
		this.id = id;
		this.cin = cin;
		this.nom = nom;
		this.adresse = adresse;
		this.telephone = telephone;
		this.mdp = mdp;
		this.service = service;
	}
	@ManyToMany(cascade = CascadeType.REMOVE)
	@JoinTable(
	  name = "planning_garde_agent",
	  joinColumns = @JoinColumn(name = "agent_id"),
	  inverseJoinColumns = @JoinColumn(name = "planning_garde_id"))
	private List<PlanningGarde> plannings;

	@JsonIgnoreProperties({"agents", "secretaires"}) // Add other properties if needed
	@ManyToOne
	private ServiceEntity service;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCin() {
		return cin;
	}

	public void setCin(String cin) {
		this.cin = cin;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getAdresse() {
		return adresse;
	}

	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getMdp() {
		return mdp;
	}

	public void setMdp(String mdp) {
		this.mdp = mdp;
	}

	public ServiceEntity getService() {
		return service;
	}

	public void setService(ServiceEntity service) {
		this.service = service;
	}
	public Agent() {}
}
	
