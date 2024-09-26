import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SectionList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Button, Modal } from 'react-native';
import axios from 'axios';
import Navbar from '../NavbarAdmin.js/Navbar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AllPlanningsScreen = () => {
  const [plannings, setPlannings] = useState([]);
  const [filteredPlannings, setFilteredPlannings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedPlanning, setSelectedPlanning] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');

  useEffect(() => {
    fetchPlannings();
  }, []);

  const fetchPlannings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.107:8036/api/plannings/all');
      setPlannings(response.data);
      setFilteredPlannings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des plannings:', error);
      setError('Une erreur est survenue lors de la récupération des plannings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = plannings.filter(planning =>
      planning.service.nom.toLowerCase().includes(search.toLowerCase()) &&
      (dateFilter ? planning.date.includes(dateFilter) : true) &&
      (agentFilter ? planning.agents.some(agent => agent.nom.toLowerCase().includes(agentFilter.toLowerCase())) : true)
    );
    setFilteredPlannings(filtered);
  }, [search, dateFilter, agentFilter, plannings]);

  const handleDelete = (planningId) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce planning ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          onPress: () => {
            axios.delete(`http://192.168.1.107:8036/api/plannings/${planningId}`)
              .then(() => {
                setPlannings(plannings.filter(planning => planning.id !== planningId));
                setFilteredPlannings(filteredPlannings.filter(planning => planning.id !== planningId));
                Alert.alert('Suppression réussie', 'Le planning a été supprimé.');
              })
              .catch(error => {
                console.error('Erreur lors de la suppression du planning:', error);
                Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
              });
          }
        }
      ]
    );
  };

  const groupPlanningsByService = (plannings) => {
    return plannings.reduce((acc, planning) => {
      const serviceName = planning.service.nom;
      if (!acc[serviceName]) {
        acc[serviceName] = [];
      }
      acc[serviceName].push(planning);
      return acc;
    }, {});
  };

  const groupedPlannings = groupPlanningsByService(filteredPlannings);

  const sections = Object.keys(groupedPlannings).map(serviceName => ({
    title: serviceName,
    data: groupedPlannings[serviceName],
  }));

  const handleDetailPress = (planning) => {
    setSelectedPlanning(planning);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPlanning(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Navbar />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par service..."
        value={search}
        onChangeText={setSearch}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Filtrer par date..."
        value={dateFilter}
        onChangeText={setDateFilter}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Filtrer par agent..."
        value={agentFilter}
        onChangeText={setAgentFilter}
      />
      <Text style={styles.title}>Tous les plannings</Text>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.planningItem}>
              <TouchableOpacity onPress={() => handleDetailPress(item)}>
                <Text style={styles.planningText}>Date: {item.date}</Text>
                <Text style={styles.planningText}>Agents: {item.agents.map(agent => agent.nom).join(', ')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="white" />
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>Aucun planning disponible</Text>
      )}
      {selectedPlanning && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Date: {selectedPlanning.date}</Text>
              <Text style={styles.modalText}>Service: {selectedPlanning.service.nom}</Text>
              <Text style={styles.modalText}>Agents: {selectedPlanning.agents.map(agent => agent.nom).join(', ')}</Text>
              <Button title="Fermer" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>
      )}
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
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  planningItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  planningText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionHeader: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default AllPlanningsScreen;
