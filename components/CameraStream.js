import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CameraStream = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FRPC Camera Streaming</Text>
      <Text style={styles.subtitle}>
        Remote access to your RTSP cameras from anywhere in the world
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CameraList')}
        >
          <Text style={styles.buttonText}>View My Cameras</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('ServerSetup')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Setup FRPS Server
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('CameraManagement')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Manage Cameras
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>• Remote RTSP camera access</Text>
        <Text style={styles.infoText}>• Secure FRPC tunneling</Text>
        <Text style={styles.infoText}>• Background service support</Text>
        <Text style={styles.infoText}>• Network camera discovery</Text>
        <Text style={styles.infoText}>• No backend required</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  infoContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default CameraStream;