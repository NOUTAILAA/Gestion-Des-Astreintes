package com.sjprogramming.restapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sjprogramming.restapi.entity.Agent;
import com.sjprogramming.restapi.entity.ServiceEntity;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByService(ServiceEntity service);
    List<Agent> findByServiceId(Long serviceId);
    
    Optional<Agent> findByEmail(String email);
    boolean existsByEmail(String email);


}