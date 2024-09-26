import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../NavbarAdmin.js/Navbar';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Fetch services from the API
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.107:8036/api/services');
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  useEffect(() => {
    if (search) {
      setFilteredServices(services.filter(service =>
        service.nom.toLowerCase().includes(search.toLowerCase())
      ));
    } else {
      setFilteredServices(services);
    }
  }, [search, services]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchServices().finally(() => setRefreshing(false));
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce service ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => {
            axios.delete(`http://192.168.1.107:8036/api/services/${id}`)
              .then(() => {
                setServices(services.filter(item => item.id !== id));
                setFilteredServices(filteredServices.filter(item => item.id !== id));
                Alert.alert("Succès", "Le service a été supprimé.");
              })
              .catch(error => {
                Alert.alert("Erreur", `Impossible de supprimer le service : ${error.message}`);
              });
          }
        }
      ]
    );
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
          placeholder="Rechercher un service..."
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddService')}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.nom}</Text>
            <Text style={styles.itemDetails}>SA: {item.sa}</Text>
            <Text style={styles.itemDetails}>Site: {item.site}</Text>
            <Text style={styles.itemDetails}>Sigle: {item.sigle}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditService', { id: item.id })}>
                <Text style={styles.buttonText} >Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#b00020',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});



export default ServicesList;
