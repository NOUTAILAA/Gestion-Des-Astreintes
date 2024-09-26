import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Navbar from '../NavbarAdmin.js/Navbar';

const CreateManualPlanning = () => {
  const [date, setDate] = useState('');
  const [services, setServices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

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

  useEffect(() => {
    if (selectedServiceId) {
      // Fetch agents based on the selected service using the updated endpoint
      axios.get(`http://192.168.1.107:8036/api/agents/service/${selectedServiceId}`)
        .then(response => {
          setAgents(response.data);
          setSelectedAgentId(null);  // Reset selected agent when service changes
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des agents:', error);
        });
    }
  }, [selectedServiceId]);

  const handleSubmit = () => {
    const requestData = {
      date: date,
      serviceId: selectedServiceId,
      agentIds: [selectedAgentId], // You can select multiple agents if needed
    };
  
    axios.post('http://192.168.1.107:8036/api/plannings/manual', requestData)
      .then(response => {
        alert('Planning créé avec succès!');
        resetForm(); // Reset the form after successful creation
      })
      .catch(error => {
        console.error('Erreur lors de la création du planning:', error);
      });
  };
  
  // Reset form and state
  const resetForm = () => {
    setDate('');                  // Clear date
    setSelectedServiceId(null);    // Clear selected service
    setSelectedAgentId(null);      // Clear selected agent
  };
  

  return (
    <View style={styles.container}>
        <Navbar/>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              style={[styles.serviceButton, selectedServiceId === service.id && styles.serviceButtonSelected]}
              onPress={() => setSelectedServiceId(service.id)}
            >
              <Text style={styles.serviceButtonText}>{service.nom}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>Aucun service disponible</Text>
        )}

        {selectedServiceId && agents.length > 0 && (
          <>
            <Text style={styles.label}>Agent</Text>
            <Picker
              selectedValue={selectedAgentId}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedAgentId(itemValue)}
            >
              <Picker.Item label="Choisissez un agent" value={null} />
              {agents.map(agent => (
                <Picker.Item key={agent.id} label={agent.nom} value={agent.id} />
              ))}
            </Picker>
          </>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button title="Créer Planning" onPress={handleSubmit} color="#007bff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  serviceButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  serviceButtonSelected: {
    backgroundColor: 'gray',
    borderColor: 'transparent',
  },
  serviceButtonText: {
    fontSize: 16,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff', // Optional: Background for better visual separation
  },
});

export default CreateManualPlanning;
