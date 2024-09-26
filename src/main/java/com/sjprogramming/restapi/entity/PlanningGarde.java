package com.sjprogramming.restapi.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class PlanningGarde {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    @ManyToMany
    @JoinTable(
      name = "planning_garde_agent",
      joinColumns = @JoinColumn(name = "planning_garde_id"),
      inverseJoinColumns = @JoinColumn(name = "agent_id"))
    private List<Agent> agents = new ArrayList<>();

    public PlanningGarde() {}

    public PlanningGarde(Long id, LocalDate date, ServiceEntity service, List<Agent> agents) {
        this.id = id;
        this.date = date;
        this.service = service;
        this.agents = agents;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public ServiceEntity getService() {
        return service;
    }

    public void setService(ServiceEntity service) {
        this.service = service;
    }

    public List<Agent> getAgents() {
        return agents;
    }

    public void setAgents(List<Agent> agents) {
        this.agents = agents;
    }
}
