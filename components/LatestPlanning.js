import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const LatestPlanningsTable = () => {
  const [plannings, setPlannings] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.107:8036/api/plannings/latest')
      .then(response => {
        setPlannings(Object.entries(response.data));
      })
      .catch(error => {
        console.error('There was an error fetching the plannings!', error);
      });
  }, []);

  const renderItem = ({ item, index }) => {
    const [serviceKey, planning] = item;
    const agents = planning.agents.length > 0
      ? planning.agents.map(agent => agent.nom).join(', ')
      : 'No agents assigned';

    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
          <Text style={styles.cell}>{planning.service.nom}</Text>
          <Text style={styles.cell}>{planning.date}</Text>
          <Text style={styles.cell}>{agents}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Service Name</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Agents</Text>
        </View>
        <FlatList
          data={plannings}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  table: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 10 }, // Adds shadow on iOS
    shadowOpacity: 0.25, // Adds shadow on iOS
    shadowRadius: 12, // Adds shadow on iOS
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
  },
  headerCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evenRow: {
    backgroundColor: '#F9FAFB',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 5,
    marginVertical: 2,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default LatestPlanningsTable;
