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
import com.sjprogramming.restapi.repository.ServiceRepository;

@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public ServiceEntity createService(ServiceEntity service) {
        return serviceRepository.save(service);
    }
    public ServiceEntity getServiceById(Long id) {
        return serviceRepository.findById(id).orElse(null);
    }

    public ServiceEntity updateService(Long id, ServiceEntity serviceDetails) {
        ServiceEntity service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found for this id :: " + id));
        service.setNom(serviceDetails.getNom());
        service.setSa(serviceDetails.getSa());
        service.setSite(serviceDetails.getSite());
        service.setSigle(serviceDetails.getSigle());
        return serviceRepository.save(service);
    }

    public Map<String, Boolean> deleteService(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found for this id :: " + id));
        serviceRepository.delete(service);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
