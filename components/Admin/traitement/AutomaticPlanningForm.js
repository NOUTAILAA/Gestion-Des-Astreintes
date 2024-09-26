import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import Navbar from '../NavbarAdmin.js/Navbar';

const AutomaticPlanningForm = () => {
  const [date, setDate] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    // Fetch services
    axios.get('http://192.168.1.107:8036/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des services:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (!date || !selectedServiceId) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  
    // Log the values before sending the request
    console.log("Date:", date);
    console.log("Selected Service ID:", selectedServiceId);
  
    const requestData = {
      date: date,
      serviceId: selectedServiceId
    };
  
    // Log the request data to see what is being sent
    console.log("Request Data:", requestData);
  
    axios.post(`http://192.168.1.107:8036/api/plannings/create/serviceId=${selectedServiceId}&date=${date}`)
    .then(response => {
      console.log("Response:", response.data); // Log the success response
      alert('Planning automatique créé avec succès!');
      resetForm(); // Reset the form after successful creation
    })
    .catch(error => {
      // Log the error to see why the request failed
      console.error("Erreur lors de la création du planning:", error);
      if (error.response) {
        console.log("Error Response Data:", error.response.data);  // Backend response details
        console.log("Error Response Status:", error.response.status);  // HTTP status code
        console.log("Error Response Headers:", error.response.headers);  // Headers
      } else if (error.request) {
        console.log("Error Request Data:", error.request);  // Request details if no response
      } else {
        console.log("General Error:", error.message);  // General error message
      }
    });
  
  };
  
  
  

  // Reset form and state
  const resetForm = () => {
    setDate('');                  // Clear date
    setSelectedServiceId(null);    // Clear selected service
  };

  return (
    <View style={styles.container}>
    <Navbar/>
      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Service</Text>
      {services.length > 0 ? (
        services.map(service => (
          <TouchableOpacity
            key={service.id}
            style={[styles.radioButton, selectedServiceId === service.id && styles.radioButtonSelected]}
            onPress={() => setSelectedServiceId(service.id)}
          >
            <Text style={styles.radioButtonText}>{service.nom}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Aucun service disponible</Text>
      )}

      <Button title="Créer Planning Automatique" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#ddd',
  },
  radioButtonText: {
    fontSize: 16,
  },
});

export default AutomaticPlanningForm;
