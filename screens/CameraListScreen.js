import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import CameraTunnelService from '../services/CameraTunnelService';

const CameraListScreen = ({ navigation }) => {
  const [cameras, setCameras] = useState([]);
  const [tunnelStatus, setTunnelStatus] = useState({ isActive: false });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    
    // Set up status listener
    const unsubscribe = CameraTunnelService.onStatusChange((status) => {
      setTunnelStatus(status);
    });

    return unsubscribe;
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cameraList, status] = await Promise.all([
        CameraTunnelService.getCameras(),
        CameraTunnelService.getTunnelStatus()
      ]);
      
      setCameras(cameraList);
      setTunnelStatus(status);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartTunnel = async () => {
    try {
      const result = await CameraTunnelService.setupAndStart();
      if (result.success) {
        Alert.alert('Success', result.message);
        loadData();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start tunnel');
    }
  };

  const handleStopTunnel = async () => {
    Alert.alert(
      'Stop Tunnel',
      'Are you sure you want to stop the camera tunnel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await CameraTunnelService.stopTunnel();
              if (result.success) {
                Alert.alert('Success', result.message);
                loadData();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to stop tunnel');
            }
          }
        }
      ]
    );
  };

  const handleViewCamera = async (camera) => {
    if (!tunnelStatus.isActive) {
      Alert.alert(
        'Tunnel Not Active',
        'Please start the tunnel first to view camera streams.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start Tunnel', onPress: handleStartTunnel }
        ]
      );
      return;
    }

    try {
      const streamUrl = await CameraTunnelService.getCameraStreamURL(camera);
      navigation.navigate('CameraStream', {
        camera: camera,
        streamUrl: streamUrl
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get camera stream URL');
    }
  };

  const renderCameraItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.cameraItem,
        !item.enabled && styles.disabledCamera
      ]}
      onPress={() => handleViewCamera(item)}
      disabled={!item.enabled}
    >
      <View style={styles.cameraInfo}>
        <Text style={styles.cameraName}>{item.name}</Text>
        <Text style={styles.cameraDetails}>
          Local: {item.localIP}:{item.localPort}
        </Text>
        <Text style={styles.cameraDetails}>
          Remote Port: {item.remotePort}
        </Text>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.enabled ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.enabled ? '#4CAF50' : '#F44336' }
          ]}>
            {item.enabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cameraActions}>
        <Text style={styles.viewText}>Tap to View</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTunnelStatus = () => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusTitle}>Tunnel Status</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: tunnelStatus.isActive ? '#4CAF50' : '#F44336' }
        ]}>
          <Text style={styles.statusIndicatorText}>
            {tunnelStatus.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
      </View>
      
      {tunnelStatus.startedAt && (
        <Text style={styles.statusDetails}>
          Started: {new Date(tunnelStatus.startedAt).toLocaleString()}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.tunnelButton,
          tunnelStatus.isActive ? styles.stopButton : styles.startButton
        ]}
        onPress={tunnelStatus.isActive ? handleStopTunnel : handleStartTunnel}
      >
        <Text style={styles.tunnelButtonText}>
          {tunnelStatus.isActive ? 'Stop Tunnel' : 'Start Tunnel'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading cameras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cameras</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('ServerSetup')}
          >
            <Text style={styles.headerButtonText}>Server Setup</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('CameraManagement')}
          >
            <Text style={styles.headerButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={cameras}
        renderItem={renderCameraItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderTunnelStatus}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cameras configured</Text>
            <Text style={styles.emptySubtext}>
              Set up your FRPS server and add cameras to get started
            </Text>
            
            <View style={styles.emptyActions}>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('ServerSetup')}
              >
                <Text style={styles.emptyButtonText}>Setup Server</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('CameraManagement')}
              >
                <Text style={styles.emptyButtonText}>Add Cameras</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIndicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  tunnelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  tunnelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledCamera: {
    opacity: 0.6,
  },
  cameraInfo: {
    flex: 1,
  },
  cameraName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cameraDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cameraActions: {
    alignItems: 'center',
  },
  viewText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 15,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default CameraListScreen;