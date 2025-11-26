import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NetworkTest = ({ cameraIP = '192.168.1.10' }) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Test HTTP connection to camera
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`http://${cameraIP}`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 401) {
        setResult({ success: true, message: 'Camera reachable via HTTP' });
      } else {
        setResult({ success: false, message: `HTTP Error: ${response.status}` });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setResult({ success: false, message: 'Connection timeout (30s)' });
      } else {
        setResult({ success: false, message: `Network error: ${error.message}` });
      }
    }

    setTesting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Test</Text>
      <Text style={styles.subtitle}>Testing: {cameraIP}</Text>
      
      <TouchableOpacity 
        style={[styles.button, testing && styles.buttonDisabled]} 
        onPress={testConnection}
        disabled={testing}
      >
        <Ionicons 
          name={testing ? "sync" : "wifi"} 
          size={20} 
          color="#FFFFFF" 
        />
        <Text style={styles.buttonText}>
          {testing ? "Testing..." : "Test Connection"}
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={[styles.result, result.success ? styles.success : styles.error]}>
          <Ionicons 
            name={result.success ? "checkmark-circle" : "close-circle"} 
            size={20} 
            color={result.success ? "#4CAF50" : "#FF6B6B"} 
          />
          <Text style={styles.resultText}>{result.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(64,64,64,0.7)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#4A9EFF',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4A9EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#666666',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  success: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  error: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
});

export default NetworkTest;