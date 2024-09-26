import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const AddSecretary = () => {
  const [cin, setCin] = useState('');
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mdp, setMdp] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.1.107:8036/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        Alert.alert("Erreur", `Impossible de charger les services : ${error.message}`);
      });
  }, []);

  const handleSubmit = () => {
    const newSecretary = { cin, nom, adresse, telephone, mdp, service: { id: serviceId } };
    
    axios.post('http://192.168.1.107:8036/api/secretaires', newSecretary)
      .then(response => {
        Alert.alert("Succès", "Le secrétaire a été ajouté.");
        navigation.goBack(); // Navigate back to the list of secretaries
      })
      .catch(error => {
        Alert.alert("Erreur", `Impossible d'ajouter le secrétaire : ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ajouter un Secrétaire</Text>
        <TextInput
          style={styles.input}
          placeholder="CIN"
          value={cin}
          onChangeText={setCin}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={adresse}
          onChangeText={setAdresse}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={telephone}
          onChangeText={setTelephone}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={mdp}
          secureTextEntry
          onChangeText={setMdp}
        />
        <Picker
          selectedValue={serviceId}
          style={styles.picker}
          onValueChange={(itemValue) => setServiceId(itemValue)}
        >
          <Picker.Item label="Choisir un service..." value="" />
          {services.map((service) => (
            <Picker.Item key={service.id} label={service.nom} value={service.id} />
          ))}
        </Picker>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Ajouter Secrétaire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'flex-start', // Aligns content at the top
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20, // Optional: gives some space around the button
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddSecretary;
