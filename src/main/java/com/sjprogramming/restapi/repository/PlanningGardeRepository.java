package com.sjprogramming.restapi.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sjprogramming.restapi.entity.PlanningGarde;
import com.sjprogramming.restapi.entity.ServiceEntity;

@Repository
public interface PlanningGardeRepository extends JpaRepository<PlanningGarde, Long> {
    List<PlanningGarde> findByServiceAndDate(ServiceEntity service, LocalDate date);
    @Query("SELECT pg FROM PlanningGarde pg JOIN pg.agents a WHERE a.id = :agentId ORDER BY pg.date DESC")
    List<PlanningGarde> findTopByAgentIdOrderByDateDesc(@Param("agentId") Long agentId);
    @Query("SELECT pg FROM PlanningGarde pg WHERE pg.service = :service ORDER BY pg.date DESC")
    PlanningGarde findTopByServiceOrderByDateDesc(@Param("service") ServiceEntity service);
    @Query("SELECT pg FROM PlanningGarde pg WHERE pg.service = :service ORDER BY pg.date DESC")
    List<PlanningGarde> findLatestPlanningByService(@Param("service") ServiceEntity service);
    @Query("SELECT pg FROM PlanningGarde pg WHERE pg.service = :service ORDER BY pg.date DESC")
    List<PlanningGarde> findLatestByServiceOrderByDateDesc(@Param("service") ServiceEntity service);
  
}
