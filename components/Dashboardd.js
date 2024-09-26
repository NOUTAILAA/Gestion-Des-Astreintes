import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Navbar from './Navbar';
const Home = () => {
  const [animationValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(7000),
        Animated.parallel([
          Animated.timing(animationValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    animate();

    return () => {
      animationValue.stopAnimation();
      scaleValue.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
    <Navbar/>
      <Animated.View style={[styles.jumbotron, { opacity: animationValue }]}>
        <Animated.Text style={[styles.title, { transform: [{ scale: scaleValue }] }]}>
        Bienvenue dans le Système de Gestion des Plannings        </Animated.Text>
        <Animated.Text style={[styles.lead, { opacity: animationValue }]}>
        Consultez vos gardes à venir, vérifiez vos disponibilités et restez informé en temps réel.                
                </Animated.Text>
        
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumbotron: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  lead: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Roboto-Regular',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
