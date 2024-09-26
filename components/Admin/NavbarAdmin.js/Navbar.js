import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Vous pouvez utiliser d'autres jeux d'icônes si vous préférez
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Agents')} style={styles.button}>
        <Icon name="people-outline" size={24} color="#000" />
        <Text style={styles.text}>Agents</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Secretaires')} style={styles.button}>
        <Icon name="person-outline" size={24} color="#000" />
        <Text style={styles.text}>Secretaires</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Services')} style={styles.button}>
        <Icon name="briefcase-outline" size={24} color="#000" />
        <Text style={styles.text}>Services</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Icon name="calendar-outline" size={24} color="#000" />
        <Text style={styles.text}>Planning</Text>
      </TouchableOpacity>

      {/* Modal for Planning */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir le type de planning</Text>
            <TouchableOpacity 
              style={[styles.optionButton, styles.manualButton]} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('ManualPlanningAdmin');
              }}
            >
              <Text style={styles.optionText}>🛠 Manuel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, styles.automaticButton]} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AutomaticPlanningAdmin');
              }}
            >
              <Text style={styles.optionText}>🚀 Automatique</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AllPlannings');
              }}
            >
              <Text style={styles.optionText}>📅 Tous les plannings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  },
  button: {
    alignItems: 'center',
  },
  text: {
    color: '#000',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10, // Adds a shadow for Android
    shadowColor: '#000', // Adds a shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    elevation: 3, // Adds a shadow effect
  },
  manualButton: {
    borderColor: '#4CAF50', // Green border
    borderWidth: 2,
  },
  automaticButton: {
    borderColor: '#2196F3', // Blue border
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#f44336', // Red background
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Navbar;
