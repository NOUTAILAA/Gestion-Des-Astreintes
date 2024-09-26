import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const AgentsSecretaires = ({ route }) => {
  const { serviceId, secretaireId } = route.params;
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [planningModalVisible, setPlanningModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [newAgent, setNewAgent] = useState({
    cin: '',
    nom: '',
    adresse: '',
    telephone: '',
    mdp: '',
    email: '',  // Ajoutez cette ligne
  });
  

  const [planning, setPlanning] = useState({
    date: '',
    agentIds: [],
  });

  useEffect(() => {
    fetch(`http://192.168.1.107:8036/api/agents/service/${serviceId}`)
      .then((response) => response.json())
      .then((data) => {
        setAgents(data);
        setFilteredAgents(data);
      })
      .catch((error) => console.error('Error fetching agents:', error));
  }, [serviceId]);

  useEffect(() => {
    // Filter agents based on search query
    const filtered = agents.filter(agent =>
      (agent.nom ? agent.nom.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (agent.cin ? agent.cin.toLowerCase().includes(searchQuery.toLowerCase()) : false)
    );
    setFilteredAgents(filtered);
  }, [searchQuery, agents]);

  const handleAddOrEditAgent = () => {
    if (!newAgent.cin || !newAgent.nom || !newAgent.adresse || !newAgent.telephone || !newAgent.mdp || !newAgent.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
  
    // Vérifiez si l'email existe déjà
    const emailExists = agents.some(agent => agent.email === newAgent.email && agent.id !== currentAgent?.id);
    if (emailExists) {
      Alert.alert('Erreur', 'L\'email existe déjà');
      return;
    }
  
    const apiUrl = editMode
      ? `http://192.168.1.107:8036/api/agents/${currentAgent.id}`
      : 'http://192.168.1.107:8036/api/agents';
  
    const method = editMode ? 'PUT' : 'POST';
  
    fetch(apiUrl, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newAgent,
        service: { id: serviceId },
      }),
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else {
          throw new Error('Erreur lors de l\'enregistrement de l\'agent');
        }
      })
      .then((agentData) => {
        if (editMode) {
          setAgents((prevAgents) => prevAgents.map((agent) => (agent.id === agentData.id ? agentData : agent)));
        } else {
          setAgents([...agents, agentData]);
        }
        setModalVisible(false);
        resetAgentForm();
        Alert.alert('Succès', editMode ? 'Agent modifié avec succès' : 'Agent ajouté avec succès');
      })
      .catch((error) => {
        console.error('Error saving agent:', error.message);
        Alert.alert('Erreur', error.message);
      });
  };
  
  const handleDeleteAgent = (id) => {
    fetch(`http://192.168.1.107:8036/api/agents/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== id));
          Alert.alert('Succès', 'Agent supprimé avec succès');
        } else {
          throw new Error('Erreur lors de la suppression de l\'agent');
        }
      })
      .catch((error) => {
        console.error('Error deleting agent:', error.message);
        Alert.alert('Erreur', error.message);
      });
  };

  const handleCreateManualPlanning = () => {
    if (!planning.date || planning.agentIds.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!secretaireId) {
      console.error('ID du secrétaire est undefined');
      Alert.alert('Erreur', 'ID du secrétaire est manquant');
      return;
    }

    fetch(`http://192.168.1.107:8036/api/plannings/manual/${secretaireId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planning),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.text();
        } else {
          throw new Error('Erreur lors de la création du planning');
        }
      })
      .then((message) => {
        Alert.alert('Succès', message);
        setPlanning({ date: '', agentIds: [] });
      })
      .catch((error) => {
        console.error('Error creating manual planning:', error.message);
        Alert.alert('Erreur', error.message);
      });
  };

  const handleCreateAutoPlanning = () => {
    if (!planning.date) {
      Alert.alert('Erreur', 'Veuillez saisir une date');
      return;
    }

    if (!secretaireId) {
      console.error('ID du secrétaire est undefined');
      Alert.alert('Erreur', 'ID du secrétaire est manquant');
      return;
    }

    fetch(`http://192.168.1.107:8036/api/plannings/auto/${secretaireId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: planning.date }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.text();
        } else {
          throw new Error('Erreur lors de la création du planning automatique');
        }
      })
      .then((message) => {
        Alert.alert('Succès', message);
        setPlanning({ date: '', agentIds: [] });
      })
      .catch((error) => {
        console.error('Error creating automatic planning:', error.message);
        Alert.alert('Erreur', error.message);
      });
  };

  const openEditModal = (agent) => {
    setNewAgent(agent);
    setCurrentAgent(agent);
    setEditMode(true);
    setModalVisible(true);
  };

  const resetAgentForm = () => {
    setNewAgent({ cin: '', nom: '', adresse: '', telephone: '', mdp: '' });
    setEditMode(false);
    setCurrentAgent(null);
  };

  const handleAgentSelection = (value) => {
    setPlanning((prevPlanning) => ({
      ...prevPlanning,
      agentIds: value ? value.split(',').map(id => parseInt(id, 10)) : [],
    }));
  };

  const agentOptions = agents.map(agent => ({
    label: agent.nom,
    value: agent.id.toString(),
  }));

  return (
    <View style={styles.container}>
      {/* Add Agent Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          resetAgentForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Ajouter un agent</Text>
      </TouchableOpacity>

      {/* Search Input */}
      <TextInput
        placeholder="Rechercher par nom ou CIN"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredAgents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.agentItem}>
            <Text style={styles.agentText}>Nom: {item.nom}</Text>
            <Text style={styles.agentText}>CIN: {item.cin}</Text>
            <Text style={styles.agentText}>Adresse: {item.adresse}</Text>
            <Text style={styles.agentText}>Téléphone: {item.telephone}</Text>
            <Text style={styles.agentText}>Mot de passe: {item.mdp}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                <Text style={styles.editButtonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAgent(item.id)}>
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setPlanningModalVisible(true)}
      >
        <Text style={styles.buttonText}>Créer Planning</Text>
      </TouchableOpacity>

      {/* Modal for Adding/Editing Agent */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editMode ? 'Modifier l\'agent' : 'Ajouter un agent'}</Text>
          <TextInput
            placeholder="CIN"
            value={newAgent.cin}
            onChangeText={(text) => setNewAgent((prev) => ({ ...prev, cin: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Nom"
            value={newAgent.nom}
            onChangeText={(text) => setNewAgent((prev) => ({ ...prev, nom: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Adresse"
            value={newAgent.adresse}
            onChangeText={(text) => setNewAgent((prev) => ({ ...prev, adresse: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Téléphone"
            value={newAgent.telephone}
            onChangeText={(text) => setNewAgent((prev) => ({ ...prev, telephone: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            value={newAgent.mdp}
            onChangeText={(text) => setNewAgent((prev) => ({ ...prev, mdp: text }))}
            
            style={styles.input}
          />
          <TextInput
  placeholder="Email"
  value={newAgent.email}
  onChangeText={(text) => setNewAgent((prev) => ({ ...prev, email: text }))}  // Ajoutez cette ligne
  style={styles.input}
/>
          <Button
            title={editMode ? 'Modifier' : 'Ajouter'}
            onPress={handleAddOrEditAgent}
          />
          <Button
            title="Annuler"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>

      {/* Modal for Creating Planning */}
      <Modal
        visible={planningModalVisible}
        onRequestClose={() => setPlanningModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Créer Planning</Text>
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={planning.date}
            onChangeText={(text) => setPlanning((prev) => ({ ...prev, date: text }))}
            style={styles.input}
          />
          <RNPickerSelect
            placeholder={{ label: 'Sélectionner les agents...', value: null }}
            items={agentOptions}
            onValueChange={handleAgentSelection}
            value={planning.agentIds.join(',')}
            style={pickerSelectStyles}
          />
          <Button
            title="Créer Planning Manuel"
            onPress={handleCreateManualPlanning}
          />
          <Button
            title="Créer Planning Automatique"
            onPress={handleCreateAutoPlanning}
          />
          <Button
            title="Annuler"
            onPress={() => setPlanningModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  agentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  agentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  inputAndroid: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default AgentsSecretaires;
