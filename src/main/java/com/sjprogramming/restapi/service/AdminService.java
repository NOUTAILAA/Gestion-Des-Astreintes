package com.sjprogramming.restapi.service;

import com.sjprogramming.restapi.entity.Admin;
import com.sjprogramming.restapi.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    public Admin authenticateAdmin(String cin, String mdp) {
        return adminRepository.findByCinAndMdp(cin, mdp);
    }
    public Admin updateAdmin(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found for id: " + id));

        admin.setCin(adminDetails.getCin());
        admin.setMdp(adminDetails.getMdp());
        admin.setTelephone(adminDetails.getTelephone());
        admin.setAdresse(adminDetails.getAdresse());
        admin.setNom(adminDetails.getNom());

        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found for id: " + id));

        adminRepository.delete(admin);
    }
}
