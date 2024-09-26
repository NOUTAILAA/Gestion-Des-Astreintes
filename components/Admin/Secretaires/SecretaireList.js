import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../NavbarAdmin.js/Navbar';

const SecretariesList = () => {
  const [secretaries, setSecretaries] = useState([]);
  const [filteredSecretaries, setFilteredSecretaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation(); // Hook de navigation

  // Fonction pour charger la liste des secrétaires
  const fetchSecretaries = useCallback(() => {
    setLoading(true);
    axios.get('http://192.168.1.107:8036/api/secretaires')
      .then(response => {
        setSecretaries(response.data);
        setFilteredSecretaries(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSecretaries();
  }, [fetchSecretaries]);

  useFocusEffect(
    useCallback(() => {
      fetchSecretaries(); // Re-fetch secretaries when the screen comes into focus
    }, [fetchSecretaries])
  );
  

  const handleEdit = (id) => {
    navigation.navigate('EditSecretary', { id }); // Don't pass refreshList
  };
  

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce secrétaire ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => {
            axios.delete(`http://192.168.1.107:8036/api/secretaires/${id}`)
              .then(() => {
                setSecretaries(secretaries.filter(item => item.id !== id));
                setFilteredSecretaries(secretaries.filter(item => item.id !== id));
                Alert.alert("Succès", "Le secrétaire a été supprimé.");
              })
              .catch(error => {
                Alert.alert("Erreur", `Impossible de supprimer le secrétaire : ${error.message}`);
              });
          }
        }
      ]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredSecretaries(secretaries);
    } else {
      const filtered = secretaries.filter(sec =>
        sec.nom.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSecretaries(filtered);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Erreur: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un secrétaire"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddSecretary')}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredSecretaries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.nom}</Text>
            <Text style={styles.itemService}>{item.service ? item.service.nom : 'Aucun service'}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEdit(item.id)}>
                <Text style={styles.buttonText}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
  },
  itemService: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 80,
    flex: 1,
    marginHorizontal: 7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButton: {
    backgroundColor: '#1767', 
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SecretariesList;
