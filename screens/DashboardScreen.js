import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [setupStep, setSetupStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeModal(false);
      setShowSetupGuide(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const setupSteps = [
    {
      title: 'Add your First Camera',
      description: 'Set up surveillance by adding and configuring your camera.',
      image: require('../Add_Camera.png')
    },
    {
      title: 'Configure Zones',
      description: 'Define specific monitoring areas and zones for targeted security.',
      image: require('../Configure_Zones.png')
    },
    {
      title: 'Monitor & Alerts',
      description: 'Receive real-time notifications for security events.',
      image: require('../Monitor_Alerts.png')
    }
  ];

  const handleSetupNext = () => {
    if (setupStep < setupSteps.length - 1) {
      setSetupStep(setupStep + 1);
    } else {
      setShowSetupGuide(false);
    }
  };

  const handleSetupPrevious = () => {
    if (setupStep > 0) {
      setSetupStep(setupStep - 1);
    }
  };

  return (
    <LinearGradient colors={['#0B1437', '#0B1437', '#000000']} locations={[0, 0.55, 1]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Add Camera Button */}
      <TouchableOpacity style={styles.addCameraButton}>
        <Ionicons name="camera" size={16} color="#4A9EFF" style={styles.addCameraIcon} />
        <Text style={styles.addCameraText}>Add Camera</Text>
      </TouchableOpacity>

      {/* Real Time Alerts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Real Time Alerts</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#8B92A7" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location"
              placeholderTextColor="#8B92A7"
            />
          </View>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash" size={20} color="#8B92A7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Available Cameras Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Cameras (1)</Text>
        <View style={styles.cameraGrid}>
          <View style={styles.cameraCard}>
            <Text style={styles.cameraIcon}>📹</Text>
            <Text style={styles.cameraStatus}>Stream inactive</Text>
            <TouchableOpacity style={styles.streamButton}>
              <Text style={styles.streamButtonText}>▶ Stream</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.cameraCard, styles.emptyCameraCard]} />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="apps" size={20} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="location" size={20} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="add" size={24} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="time" size={20} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings" size={20} color="#8B92A7" />
        </TouchableOpacity>
      </View>

      {/* Welcome Modal */}
      <Modal visible={showWelcomeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.welcomeModal}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={styles.obexText}>OBEX</Text>, User.
            </Text>
            <Text style={styles.welcomeSubtext}>
              Let's get you started with a quick setup guide.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Setup Guide Modal */}
      <Modal visible={showSetupGuide} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.setupModal}>
            <View style={styles.setupProgressContainer}>
              {setupSteps.map((_, index) => (
                <React.Fragment key={index}>
                  <View
                    style={[
                      styles.setupProgressDot,
                      index === setupStep ? styles.setupProgressDotActive : 
                      index < setupStep ? styles.setupProgressDotCompleted : styles.setupProgressDotInactive
                    ]}
                  />
                  {index < setupSteps.length - 1 && (
                    <View style={[
                      styles.progressLine,
                      index < setupStep ? styles.progressLineCompleted : styles.progressLineInactive
                    ]} />
                  )}
                </React.Fragment>
              ))}
            </View>
            
            <Text style={styles.setupTitle}>{setupSteps[setupStep].title}</Text>
            <Image source={setupSteps[setupStep].image} style={styles.setupImage} />
            <Text style={styles.setupDescription}>{setupSteps[setupStep].description}</Text>
            <Text style={styles.setupCounter}>{setupStep + 1} of {setupSteps.length}</Text>
            
            <View style={styles.setupButtonContainer}>
              <TouchableOpacity 
                style={[styles.setupButton, styles.setupPreviousButton]}
                onPress={handleSetupPrevious}
                disabled={setupStep === 0}
              >
                <Text style={styles.setupPreviousButtonText}>Previous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.setupButton, styles.setupNextButton]}
                onPress={handleSetupNext}
              >
                <Text style={styles.setupNextButtonText}>
                  {setupStep === setupSteps.length - 1 ? 'Start' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1437',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notificationButton: {
    padding: 8,
  },

  addCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#4A9EFF',
    borderRadius: 0,
  },
  addCameraIcon: {
    marginRight: 8,
  },
  addCameraText: {
    color: '#4A9EFF',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141B2D',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginRight: 12,
    height: 44,
  },
  searchIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingRight: 12,
  },
  deleteButton: {
    padding: 8,
  },

  cameraGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cameraCard: {
    width: '48%',
    backgroundColor: '#1A2342',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
  },
  emptyCameraCard: {
    backgroundColor: '#0F1A2E',
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cameraStatus: {
    color: '#8B92A7',
    fontSize: 14,
    marginBottom: 12,
  },
  streamButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  streamButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    flexDirection: 'row',
    backgroundColor: '#1A2342',
    borderRadius: 25,
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  navItem: {
    padding: 8,
  },
  navItemActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeModal: {
    backgroundColor: '#1A2342',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  obexText: {
    color: '#4A9EFF',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#8B92A7',
    textAlign: 'center',
  },
  setupModal: {
    backgroundColor: '#1A2342',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    alignItems: 'center',
  },
  setupProgressContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  setupProgressDot: {
    width: 12,
    height: 12,
    borderRadius: 0,
  },
  setupProgressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  setupProgressDotInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B92A7',
  },
  setupProgressDotCompleted: {
    backgroundColor: '#8B92A7',
  },
  progressLine: {
    width: 30,
    height: 2,
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: '#8B92A7',
  },
  progressLineInactive: {
    backgroundColor: '#8B92A7',
    opacity: 0.3,
  },
  setupTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  setupImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  setupDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  setupCounter: {
    fontSize: 14,
    color: '#8B92A7',
    marginBottom: 24,
  },
  setupButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  setupButton: {
    flex: 1,
    height: 48,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  setupPreviousButton: {
    borderWidth: 1,
    borderColor: '#4A9EFF',
  },
  setupPreviousButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  setupNextButton: {
    backgroundColor: '#FFFFFF',
  },
  setupNextButtonText: {
    color: '#0A1128',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;