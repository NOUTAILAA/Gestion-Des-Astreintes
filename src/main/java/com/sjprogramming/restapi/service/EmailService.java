package com.sjprogramming.restapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
    	try { SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
        System.out.println("Sending email to: " + to); // Ajoutez ceci pour déboguer

    }
    catch (Exception e) {
        System.err.println("Error sending email: " + e.getMessage()); // Log de l'erreur
    }
}}
