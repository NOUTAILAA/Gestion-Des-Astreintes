import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const EditSecretaire = () => {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  
  const [secretaire, setSecretaire] = useState({
    cin: '',
    nom: '',
    telephone: '',
    service: '',
    mdp: '',
  });
  const [services, setServices] = useState([]);

  const refreshList = useCallback(() => {}, []);
  useFocusEffect(refreshList);

  useEffect(() => {
    axios.get(`http://192.168.1.107:8036/api/secretaires/${id}`)
      .then(response => {
        const secretaireData = response.data;
        setSecretaire({
          cin: secretaireData.cin,
          nom: secretaireData.nom,
          telephone: secretaireData.telephone,
          service: secretaireData.service ? secretaireData.service.id : '',
          mdp: secretaireData.mdp,
        });
      })
      .catch(error => {
        Alert.alert('Erreur', `Impossible de charger les détails : ${error.message}`);
      });
  }, [id]);

  useEffect(() => {
    axios.get('http://192.168.1.107:8036/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        Alert.alert('Erreur', `Impossible de charger les services : ${error.message}`);
      });
  }, []);

  const handleChange = (name, value) => {
    setSecretaire({ ...secretaire, [name]: value });
  };

  const handleSubmit = () => {
    axios.put(`http://192.168.1.107:8036/api/secretaires/${id}`, secretaire)
      .then(() => {
        Alert.alert('Succès', 'Les détails du secrétaire ont été mis à jour.');
        refreshList();
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Erreur', `Impossible de mettre à jour les détails : ${error.message}`);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier Secrétaire</Text>
      <Text style={styles.label}>CIN</Text>
      <TextInput
        style={styles.input}
        value={secretaire.cin}
        onChangeText={(text) => handleChange('cin', text)}
      />
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={secretaire.nom}
        onChangeText={(text) => handleChange('nom', text)}
      />
      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={secretaire.telephone}
        onChangeText={(text) => handleChange('telephone', text)}
      />
      <Text style={styles.label}>Service</Text>
      <View style={styles.serviceContainer}>
        <Text style={styles.pickerLabel}>Sélectionner un service</Text>
        {services.map(service => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceButton}
            onPress={() => handleChange('service', service.id)}
          >
            <Text style={styles.serviceButtonText}>{service.nom}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={secretaire.mdp}
        onChangeText={(text) => handleChange('mdp', text)}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Mettre à jour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#343a40',
  },
  input: {
    borderColor: '#ced4da',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  serviceButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditSecretaire;
