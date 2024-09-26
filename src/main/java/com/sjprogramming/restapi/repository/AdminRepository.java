
package com.sjprogramming.restapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sjprogramming.restapi.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
	@Query("SELECT a FROM Admin a WHERE a.cin = :cin AND a.mdp = :mdp")
    Admin findByCinAndMdp(@Param("cin") String cin, @Param("mdp") String mdp);
}