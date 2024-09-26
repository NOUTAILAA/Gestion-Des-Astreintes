import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditService = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { id } = params || {};

  // State variables for the service attributes
  const [nom, setNom] = useState('');
  const [sa, setSa] = useState('');
  const [site, setSite] = useState('');
  const [sigle, setSigle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await axios.get(`http://192.168.1.107:8036/api/services/${id}`);
      const { nom, sa, site, sigle } = response.data;
      setNom(nom);
      setSa(sa);
      setSite(site);
      setSigle(sigle);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'There was an error fetching the service!');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://192.168.1.107:8036/api/services/${id}`, { nom, sa, site, sigle });
      Alert.alert('Success', 'Service updated successfully!');
      navigation.navigate('Services'); // Ensure 'Services' is the correct route name
    } catch (error) {
      Alert.alert('Error', 'There was an error updating the service!');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Service</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Service Name</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Enter service name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>SA</Text>
        <TextInput
          style={styles.input}
          value={sa}
          onChangeText={setSa}
          placeholder="Enter SA"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Site</Text>
        <TextInput
          style={styles.input}
          value={site}
          onChangeText={setSite}
          placeholder="Enter site"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sigle</Text>
        <TextInput
          style={styles.input}
          value={sigle}
          onChangeText={setSigle}
          placeholder="Enter sigle"
        />
      </View>
      <Button title="Update" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditService;
