import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';

const { width, height } = Dimensions.get('window');

const CameraStreamScreen = ({ route, navigation }) => {
  const { camera, streamUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    navigation.setOptions({
      title: camera.name,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleReconnect}
        >
          <Text style={styles.headerButtonText}>Reconnect</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, camera.name]);

  const handleVideoLoadStart = () => {
    setLoading(true);
    setError(null);
    setConnectionStatus('Connecting...');
  };

  const handleVideoLoad = () => {
    setLoading(false);
    setError(null);
    setIsPlaying(true);
    setConnectionStatus('Connected');
  };

  const handleVideoError = (error) => {
    setLoading(false);
    setIsPlaying(false);
    setError('Failed to connect to camera stream');
    setConnectionStatus('Connection Failed');
    
    console.error('VLC Player Error:', error);
    
    Alert.alert(
      'Stream Error',
      'Failed to connect to camera stream. Please check your connection and try again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: handleReconnect }
      ]
    );
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setConnectionStatus('Stream Ended');
  };

  const handleVideoPaused = () => {
    setIsPlaying(false);
    setConnectionStatus('Paused');
  };

  const handleVideoPlaying = () => {
    setIsPlaying(true);
    setConnectionStatus('Playing');
  };

  const handleReconnect = () => {
    setLoading(true);
    setError(null);
    setConnectionStatus('Reconnecting...');
    // VLC player will automatically try to reconnect when source changes
  };

  const renderConnectionStatus = () => (
    <View style={styles.statusBar}>
      <View style={[
        styles.statusDot,
        { backgroundColor: getStatusColor() }
      ]} />
      <Text style={styles.statusText}>{connectionStatus}</Text>
      
      {loading && (
        <ActivityIndicator
          size="small"
          color="#007AFF"
          style={styles.statusLoader}
        />
      )}
    </View>
  );

  const getStatusColor = () => {
    if (isPlaying) return '#4CAF50';
    if (error) return '#F44336';
    if (loading) return '#FF9800';
    return '#666';
  };

  const renderCameraInfo = () => (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>Camera Details</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoValue}>{camera.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Local IP:</Text>
        <Text style={styles.infoValue}>{camera.localIP}:{camera.localPort}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Remote Port:</Text>
        <Text style={styles.infoValue}>{camera.remotePort}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Stream URL:</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{streamUrl}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderConnectionStatus()}
      
      <View style={styles.videoContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Camera Offline</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleReconnect}
            >
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <VLCPlayer
            source={{ uri: streamUrl }}
            autoplay={true}
            style={styles.video}
            onLoadStart={handleVideoLoadStart}
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            onEnd={handleVideoEnd}
            onPaused={handleVideoPaused}
            onPlaying={handleVideoPlaying}
            resizeMode="contain"
          />
        )}
        
        {loading && !error && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Connecting to camera...</Text>
          </View>
        )}
      </View>
      
      {renderCameraInfo()}
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleReconnect}
        >
          <Text style={styles.controlButtonText}>Reconnect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.controlButtonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  statusBar: {
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  statusLoader: {
    marginLeft: 10,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: width * (9/16), // 16:9 aspect ratio
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#F44336',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1A1A1A',
    margin: 15,
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
    width: 100,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#666',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    marginRight: 10,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraStreamScreen;