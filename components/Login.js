import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Utilisation d'icônes Ionicons
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [cin, setCin] = useState('');
  const [mdp, setMdp] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true); // Gestion de la visibilité du mot de passe
  const navigation = useNavigation();

  const handleLogin = () => {
    if (cin === 'admin' && mdp === '1234') {
      // Redirect to Agents page for admin
      navigation.navigate('Agents');
    } else {
      // Check if user is a secretaire via API
      fetch('http://192.168.1.107:8036/api/secretaires/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cin, mdp }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Invalid CIN or password');
          }
        })
        .then((secretaire) => {
          // Redirect to AgentsSecretaires page for the secretaire
          navigation.navigate('AgentsSecretaires', { serviceId: secretaire.service.id, secretaireId: secretaire.id });
        })
        .catch((error) => {
          Alert.alert('Login Error', error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="CIN"
          value={cin}
          onChangeText={setCin}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Mot de passe"
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
          <Icon name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 1, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default Login;
