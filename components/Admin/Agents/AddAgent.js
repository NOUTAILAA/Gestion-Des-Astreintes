import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Fonction pour récupérer les services depuis l'API
const fetchServices = async () => {
  try {
    const response = await fetch('http://192.168.1.107:8036/api/services');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    return [];
  }
};

// Fonction pour ajouter un nouvel agent
const addAgent = async (newAgent) => {
  try {
    const response = await fetch('http://192.168.1.107:8036/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAgent),
    });

    if (response.ok) {
      Alert.alert("Succès", "Agent ajouté avec succès");
      return true;
    } else if (response.status === 409) { // Si l'email existe déjà
      Alert.alert("Erreur", "Cet email est déjà utilisé.");
      return false;
    } else {
      Alert.alert("Erreur", "Cet email est déjà utilisé");
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'agent :", error);
    Alert.alert("Erreur", "Impossible d'ajouter l'agent");
    return false;
  }
};

const AddAgentScreen = ({ navigation, refreshAgentsList }) => {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [cin, setCin] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [services, setServices] = useState([]);

  // Récupérer les services à la montée du composant
  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices();
      setServices(data);
    };
    loadServices();
  }, []);

  // Fonction pour gérer la soumission du formulaire
  const handleAddAgent = async () => {
    const newAgent = {
      nom,
      cin,
      adresse,
      telephone,
      email,
      mdp,
      service: { id: serviceId },
    };
    
    const success = await addAgent(newAgent);
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>CIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le CIN"
          value={cin}
          onChangeText={setCin}
        />
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nom"
          value={nom}
          onChangeText={setNom}
        />
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'adresse"
          value={adresse}
          onChangeText={setAdresse}
        />
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le numéro de téléphone"
          value={telephone}
          onChangeText={setTelephone}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'email"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le mot de passe"
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry
        />
        <Picker
          selectedValue={serviceId}
          style={styles.picker}
          onValueChange={(itemValue) => setServiceId(itemValue)}
        >
          <Picker.Item label="Sélectionnez un service" value="" />
          {services.map((service) => (
            <Picker.Item key={service.id} label={service.nom} value={service.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddAgent}>
        <Text style={styles.buttonText}>Ajouter l'agent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddAgentScreen;
