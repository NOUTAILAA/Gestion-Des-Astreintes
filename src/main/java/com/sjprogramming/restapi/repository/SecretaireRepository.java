package com.sjprogramming.restapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sjprogramming.restapi.entity.Secretaire;
import com.sjprogramming.restapi.entity.ServiceEntity;

@Repository
public interface SecretaireRepository extends JpaRepository<Secretaire, Long> {
    List<Secretaire> findByService(ServiceEntity service);
    Secretaire findByCinAndMdp(String cin, String mdp);

}
