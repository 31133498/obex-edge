import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import { Ionicons } from '@expo/vector-icons';

const RTSPPlayer = ({ 
  rtspUrl, 
  style, 
  autoplay = true, 
  showControls = true,
  onError,
  onLoad 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const playerRef = useRef(null);

  const handleLoad = (data) => {
    console.log('VLC Player loaded:', data);
    setIsLoading(false);
    setHasError(false);
    onLoad && onLoad(data);
  };

  const handlePlaying = () => {
    console.log('VLC Player playing');
    setIsLoading(false);
    setIsPlaying(true);
  };

  const handleBuffering = (data) => {
    console.log('VLC Player buffering:', data);
    // Don't show loading for buffering, only for initial connection
  };

  const handleError = (error) => {
    setIsLoading(false);
    setHasError(true);
    console.error('RTSP Player Error:', error);
    console.error('RTSP URL:', rtspUrl);
    onError && onError(error);
    Alert.alert('Streaming Error', `Failed to load video stream: ${JSON.stringify(error)}\n\nURL: ${rtspUrl}\n\nCheck network and camera settings.`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReconnect = () => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(true);
  };

  // Reset loading state when URL changes
  useEffect(() => {
    if (rtspUrl) {
      setIsLoading(true);
      setHasError(false);
      
      // Force clear loading after 10 seconds if no events fire
      const timeout = setTimeout(() => {
        console.log('Forcing loading state clear after timeout');
        setIsLoading(false);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [rtspUrl]);

  if (hasError) {
    return (
      <View style={[styles.container, style, styles.errorContainer]}>
        <Ionicons name="warning-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Stream Unavailable</Text>
        <TouchableOpacity style={styles.reconnectButton} onPress={handleReconnect}>
          <Text style={styles.reconnectText}>Reconnect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <VLCPlayer
        ref={playerRef}
        style={styles.player}
        source={{ uri: rtspUrl }}
        autoplay={true}
        onLoad={handleLoad}
        onError={handleError}
        onPlaying={handlePlaying}
        onPaused={() => setIsPlaying(false)}
        onBuffering={handleBuffering}
        onOpen={() => {
          console.log('VLC Player opened');
          setIsLoading(false);
        }}
        options={{
          '--network-caching': 2000,
          '--rtsp-caching': 2000,
          '--no-audio': true,
          '--rtsp-tcp': false,
          '--live-caching': 2000,
          '--rtsp-timeout': 10000,
          '--drop-late-frames': true,
          '--skip-frames': true
        }}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A9EFF" />
          <Text style={styles.loadingText}>Connecting...</Text>
        </View>
      )}

      {showControls && !isLoading && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  player: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginTop: 12,
    marginBottom: 16,
  },
  reconnectButton: {
    backgroundColor: '#4A9EFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reconnectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RTSPPlayer;