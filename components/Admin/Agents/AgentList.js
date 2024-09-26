// AgentListScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../NavbarAdmin.js/Navbar'; // Assurez-vous que le chemin est correct

// Function to fetch agents from API
const fetchAgents = async () => {
  try {
    const response = await fetch('http://192.168.1.107:8036/api/agents');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
};

// Function to delete an agent
const deleteAgent = async (id) => {
  try {
    await fetch(`http://192.168.1.107:8036/api/agents/${id}`, {
      method: 'DELETE',
    });
    Alert.alert("Success", "Agent deleted successfully");
  } catch (error) {
    console.error("Error deleting agent:", error);
    Alert.alert("Error", "Unable to delete agent");
  }
};

const AgentListScreen = ({ navigation }) => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load agents whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadAgents = async () => {
        const data = await fetchAgents();
        setAgents(data);
        setFilteredAgents(data); // Initialize filtered agents
      };
      loadAgents();
    }, [])
  );

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = agents.filter(agent =>
      agent.nom.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAgents(filtered);
  };

  // Function to navigate to edit screen
  const handleEditAgent = (agent) => {
    navigation.navigate('EditAgent', { agent });
  };

  // Function to handle agent deletion
  const handleDeleteAgent = (id) => {
    deleteAgent(id).then(() => {
      // Update the list of agents after deletion
      setAgents(agents.filter((agent) => agent.id !== id));
      setFilteredAgents(filteredAgents.filter((agent) => agent.id !== id));
    });
  };

  // Function to navigate to add agent screen
  const handleAddAgent = () => {
    navigation.navigate('AddAgent'); // Adjust the screen name if necessary
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {/* Button to add a new agent */}
      <Button
        title="Add Agent"
        onPress={handleAddAgent}
        color="#4A90E2" // Button color
      />

      <FlatList
        data={filteredAgents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.agentItem}>
            <Text style={styles.agentText}>Cin: {item.cin}</Text>
            <Text style={styles.agentText}>Name: {item.nom}</Text>
            <Text style={styles.agentText}>Address: {item.adresse}</Text>
            <Text style={styles.agentText}>Phone: {item.telephone}</Text>
            {/* Display service */}
            <Text style={styles.agentText}>Service: {item.service ? item.service.nom : 'Not defined'}</Text>
            <View style={styles.buttons}>
              {/* Edit button */}
              <Button
                title="Edit"
                onPress={() => handleEditAgent(item)}
                color="#FF8C00" // Edit button color
              />
              {/* Delete button */}
              <Button
                title="Delete"
                onPress={() => handleDeleteAgent(item.id)}
                color="#FF0000" // Delete button color
              />
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
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  agentItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  agentText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

export default AgentListScreen;
