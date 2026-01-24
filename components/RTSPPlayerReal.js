import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VLCPlayer } from 'react-native-vlc-media-player';

const RTSPPlayerReal = ({ rtspUrl, style, onError, onLoad, showControls = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, failed
  const playerRef = useRef(null);

  useEffect(() => {
    if (rtspUrl) {
      handleConnect();
    }
    return () => {
      handleDisconnect();
    };
  }, [rtspUrl]);

  const handleConnect = async () => {
    if (!rtspUrl) return;
    
    setIsLoading(true);
    setConnectionStatus('connecting');
  };

  const handleDisconnect = () => {
    setIsPlaying(false);
    setConnectionStatus('disconnected');
    setIsLoading(false);
  };

  const handlePlayPause = () => {
    if (connectionStatus === 'connected') {
      setIsPlaying(!isPlaying);
    } else if (connectionStatus === 'disconnected' || connectionStatus === 'failed') {
      handleConnect();
    }
  };

  const handleVLCLoad = () => {
    setIsLoading(false);
    setConnectionStatus('connected');
    setIsPlaying(true);
    onLoad && onLoad({ status: 'connected' });
  };

  const handleVLCError = (error) => {
    setIsLoading(false);
    setConnectionStatus('failed');
    onError && onError(error);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#00FF00';
      case 'connecting': return '#FFA500';
      case 'failed': return '#FF0000';
      default: return '#666666';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live';
      case 'connecting': return 'Connecting...';
      case 'failed': return 'Connection Failed';
      default: return 'Disconnected';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* VLC Player */}
      <VLCPlayer
        ref={playerRef}
        source={{ uri: rtspUrl }}
        style={styles.player}
        autoplay={true}
        onLoad={handleVLCLoad}
        onError={handleVLCError}
        onPlaying={() => {
          setIsPlaying(true);
          setConnectionStatus('connected');
        }}
        onPaused={() => setIsPlaying(false)}
        onStopped={() => {
          setIsPlaying(false);
          setConnectionStatus('disconnected');
        }}
      />

      {/* Connection Status Indicator */}
      <View style={styles.statusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusLabel}>{getStatusText()}</Text>
      </View>

      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={handleDisconnect}
          >
            <Ionicons name="stop" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Connecting to stream...</Text>
        </View>
      )}

      {/* Error State */}
      {connectionStatus === 'failed' && (
        <View style={styles.errorOverlay}>
          <Ionicons name="warning" size={48} color="#FF0000" />
          <Text style={styles.errorText}>Connection Failed</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleConnect}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  player: {
    flex: 1,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  urlText: {
    color: '#8B92A7',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#4A9EFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RTSPPlayerReal;