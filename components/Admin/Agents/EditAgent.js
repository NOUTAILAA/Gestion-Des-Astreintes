import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Function to update an agent
const updateAgent = async (id, updatedAgent) => {
  try {
    const response = await fetch(`http://192.168.1.107:8036/api/agents/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAgent),
    });
    if (response.ok) {
      Alert.alert("Success", "Agent updated successfully");
    } else {
      Alert.alert("Error", "Email déjà existant");
    }
  } catch (error) {
    console.error("Error updating agent:", error);
    Alert.alert("Error", "Unable to update the agent");
  }
};

// Function to fetch services from API
const fetchServices = async () => {
  try {
    const response = await fetch('http://192.168.1.107:8036/api/services');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Function to check if an email exists
const checkEmailExists = async (email) => {
  try {
    const response = await fetch(`http://192.168.1.107:8036/api/agents/email-exists?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.exists; // Assuming the API returns { exists: true/false }
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false; // Default to false on error
  }
};

const EditAgentScreen = ({ route, navigation }) => {
  const { agent } = route.params; // Get the agent from params

  const [nom, setNom] = useState(agent.nom);
  const [adresse, setAdresse] = useState(agent.adresse);
  const [telephone, setTelephone] = useState(agent.telephone);
  const [mdp, setMdp] = useState(agent.mdp);
  const [serviceId, setServiceId] = useState(agent.service?.id || null); // Get the service ID
  const [services, setServices] = useState([]);
  const [cin, setCin] = useState(agent.cin);
  const [email, setEmail] = useState(agent.email); // New state for email

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices();
      setServices(data);
    };
    loadServices();
  }, []);

  const handleUpdate = async () => {
    // Check if the new email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      Alert.alert("Error", "This email is already in use by another agent.");
      return; // Exit if the email exists
    }

    const updatedAgent = {
      ...agent,
      nom,
      adresse,
      telephone,
      mdp,
      cin,
      email, // Include email in the updated agent
      service: { id: serviceId }, // Update the service ID
    };
    updateAgent(agent.id, updatedAgent).then(() => {
      navigation.goBack(); // Go back after update
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>CIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Cin"
          value={cin}
          onChangeText={setCin}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={nom}
          onChangeText={setNom}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={adresse}
          onChangeText={setAdresse}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={telephone}
          onChangeText={setTelephone}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry
        />

        <Text style={styles.label}>Service</Text>
        <Picker
          selectedValue={serviceId}
          onValueChange={(itemValue) => setServiceId(itemValue)}
          style={styles.picker}
        >
          {services.map((service) => (
            <Picker.Item key={service.id} label={service.nom} value={service.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    paddingBottom: 20, // Add some padding to the bottom
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditAgentScreen;
