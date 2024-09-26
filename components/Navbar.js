// Navbar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importer MaterialIcons ou une autre bibliothèque d'icônes
import { useNavigation } from '@react-navigation/native'; // Assurez-vous que vous utilisez react-navigation
const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('LatestPlanning')} style={styles.navItem}>
        <Icon name="calendar-today" size={24} color="gray" />
        <Text style={styles.navText}>Planning</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.navItem}>
        <Icon name="login" size={24} color="gray" />
        <Text style={styles.navText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    color: 'gray',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Navbar;
