import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiTester from '../utils/apiTester';
import WebSocketTester from '../utils/webSocketTester';

const DebugScreen = ({ navigation }) => {
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [isTestingWebSocket, setIsTestingWebSocket] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const runAPITests = async () => {
    setIsTestingAPI(true);
    setTestResults(null);
    
    try {
      await ApiTester.runAllTests();
      Alert.alert('API Tests Complete', 'Check console for detailed results');
    } catch (error) {
      Alert.alert('API Tests Failed', error.message);
    } finally {
      setIsTestingAPI(false);
    }
  };

  const runWebSocketTests = async () => {
    setIsTestingWebSocket(true);
    setTestResults(null);
    
    try {
      const results = await WebSocketTester.runWebSocketTests();
      setTestResults(results);
      Alert.alert('WebSocket Tests Complete', 'Check console for detailed results');
    } catch (error) {
      Alert.alert('WebSocket Tests Failed', error.message);
    } finally {
      setIsTestingWebSocket(false);
    }
  };

  const testRTSPConnection = () => {
    const rtspUrl = 'rtsp://admin:Admin1234@staging.ai.avzdax.com:557/1/1';
    Alert.alert(
      'RTSP Test',
      `Testing connection to:\n${rtspUrl}\n\nNote: Real RTSP streaming requires custom development build with VLC player.`,
      [
        { text: 'OK' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Debug & Integration Tests</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* API Tests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Backend API Tests</Text>
          <Text style={styles.sectionDescription}>
            Test all API endpoints including authentication, cameras, alerts, and model logs
          </Text>
          
          <TouchableOpacity 
            style={[styles.testButton, isTestingAPI && styles.testButtonDisabled]}
            onPress={runAPITests}
            disabled={isTestingAPI}
          >
            <Ionicons 
              name={isTestingAPI ? "hourglass" : "play"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.testButtonText}>
              {isTestingAPI ? 'Running API Tests...' : 'Run API Tests'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* WebSocket Tests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔌 WebSocket Tests</Text>
          <Text style={styles.sectionDescription}>
            Test real-time WebSocket connection and alert delivery
          </Text>
          
          <TouchableOpacity 
            style={[styles.testButton, isTestingWebSocket && styles.testButtonDisabled]}
            onPress={runWebSocketTests}
            disabled={isTestingWebSocket}
          >
            <Ionicons 
              name={isTestingWebSocket ? "hourglass" : "play"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.testButtonText}>
              {isTestingWebSocket ? 'Testing WebSocket...' : 'Test WebSocket'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* RTSP Tests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📹 RTSP Streaming Tests</Text>
          <Text style={styles.sectionDescription}>
            Test RTSP stream connection (requires custom development build)
          </Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testRTSPConnection}
          >
            <Ionicons name="videocam" size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Test RTSP Connection</Text>
          </TouchableOpacity>
        </View>

        {/* Test Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Test Configuration</Text>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Backend URL:</Text>
            <Text style={styles.configValue}>https://obex-edge-backend.onrender.com/api/v1</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>WebSocket URL:</Text>
            <Text style={styles.configValue}>wss://obex-edge-backend.onrender.com/ws/alerts</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>RTSP URL:</Text>
            <Text style={styles.configValue}>rtsp://admin:Admin1234@staging.ai.avzdax.com:557/1/1</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Test Account:</Text>
            <Text style={styles.configValue}>sannishazily@gmail.com</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Instructions</Text>
          <Text style={styles.instructionText}>
            1. Run API Tests first to verify backend connectivity{'\n'}
            2. Test WebSocket for real-time alerts{'\n'}
            3. RTSP streaming requires custom development build{'\n'}
            4. Check console logs for detailed test results{'\n'}
            5. All tests use token authentication
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: 'rgba(64,64,64,0.7)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: '#4A9EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  testButtonDisabled: {
    backgroundColor: '#666666',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  configItem: {
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  configValue: {
    fontSize: 12,
    color: '#CCCCCC',
    fontFamily: 'monospace',
  },
  instructionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
});

export default DebugScreen;