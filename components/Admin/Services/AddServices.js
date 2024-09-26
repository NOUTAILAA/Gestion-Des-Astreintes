import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddService = () => {
  const [service, setService] = useState({
    nom: '',
    sa: '',
    site: '',
    sigle: '',
  });
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setService({ ...service, [name]: value });
  };

  const handleSubmit = () => {
    axios.post('http://192.168.1.107:8036/api/services', service)
      .then(() => {
        Alert.alert('Succès', 'Le service a été ajouté.');
        navigation.goBack(); // Retourner à la liste après l'ajout
      })
      .catch(error => {
        Alert.alert('Erreur', `Impossible d'ajouter le service : ${error.message}`);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={service.nom}
        onChangeText={(text) => handleChange('nom', text)}
      />
      <Text style={styles.label}>SA</Text>
      <TextInput
        style={styles.input}
        value={service.sa}
        onChangeText={(text) => handleChange('sa', text)}
      />
      <Text style={styles.label}>Site</Text>
      <TextInput
        style={styles.input}
        value={service.site}
        onChangeText={(text) => handleChange('site', text)}
      />
      <Text style={styles.label}>Sigle</Text>
      <TextInput
        style={styles.input}
        value={service.sigle}
        onChangeText={(text) => handleChange('sigle', text)}
      />
      <Button title="Ajouter" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default AddService;
