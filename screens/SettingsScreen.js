import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState('main');
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  
  // Security states
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  const MainSettingsHub = () => (
    <View style={styles.mainHub}>
      <View style={styles.mainHeader}>
        <Text style={styles.mainTitle}>Settings</Text>
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>Active</Text>
        </View>
      </View>
      <LinearGradient
        colors={['#666666', '#FFFFFF', '#666666']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleDivider}
      />
      
      <View style={styles.navigationCards}>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.navCard}>
            <Text style={styles.navCardText}>Profile Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#8B92A7" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('notifications')}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.navCard}>
            <Text style={styles.navCardText}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#8B92A7" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('security')}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.navCard}>
            <Text style={styles.navCardText}>Security Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#8B92A7" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('system')}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.navCard}>
            <Text style={styles.navCardText}>System Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#8B92A7" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Onboarding')}>
        <Ionicons name="log-out-outline" size={24} color="#FF0000" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
  
  const ProfileSettings = () => (
    <View style={styles.detailScreen}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Profile Settings</Text>
      </View>
      <LinearGradient
        colors={['#666666', '#FFFFFF', '#666666']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleDivider}
      />
      
      <View style={styles.profileParentGrid}>
        <View style={styles.formFields}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.fieldInput}>
              <Text style={styles.fieldValue}>AdminUser</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.fieldInput}>
              <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
                <Ionicons name="mail-outline" size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.fieldValue}>admin@obex.com</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>User role</Text>
            <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.fieldInput}>
              <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
                <Ionicons name="person-circle-outline" size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.fieldValue}>Administrator</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Timezone</Text>
            <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.fieldInput}>
              <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.fieldValue}>UTC</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Language</Text>
            <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.fieldInput}>
              <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
                <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.fieldValue}>English</Text>
            </LinearGradient>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const NotificationPreferences = () => (
    <View style={styles.detailScreen}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Notification Preferences</Text>
      </View>
      <LinearGradient
        colors={['#666666', '#FFFFFF', '#666666']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleDivider}
      />
      
      <View style={styles.notificationParentGrid}>
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Email Notifications</Text>
            <Text style={styles.notificationSubtitle}>Receive alerts via email</Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={emailNotifications ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
        
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>SMS Notifications</Text>
            <Text style={styles.notificationSubtitle}>Get SMS for critical events</Text>
          </View>
          <Switch
            value={smsNotifications}
            onValueChange={setSmsNotifications}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={smsNotifications ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
        
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Whatsapp Notifications</Text>
            <Text style={styles.notificationSubtitle}>Instant messaging alerts</Text>
          </View>
          <Switch
            value={whatsappNotifications}
            onValueChange={setWhatsappNotifications}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={whatsappNotifications ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
        
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Push Notifications</Text>
            <Text style={styles.notificationSubtitle}>Mobile push notifications</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={pushNotifications ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
        
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="desktop-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Desktop Notifications</Text>
            <Text style={styles.notificationSubtitle}>Browser notifications</Text>
          </View>
          <Switch
            value={desktopNotifications}
            onValueChange={setDesktopNotifications}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={desktopNotifications ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
        
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="volume-high-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Sound Alerts</Text>
            <Text style={styles.notificationSubtitle}>Audio alerts for streams</Text>
          </View>
          <Switch
            value={soundAlerts}
            onValueChange={setSoundAlerts}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={soundAlerts ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
      </View>
    </View>
  );
  
  const SecuritySettings = () => (
    <View style={styles.detailScreen}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Security Settings</Text>
      </View>
      <LinearGradient
        colors={['#666666', '#FFFFFF', '#666666']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleDivider}
      />
      
      <View style={styles.securityParentGrid}>
        <View style={styles.notificationRow}>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.iconBackground}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Two Factor Authentication</Text>
            <Text style={styles.notificationSubtitle}>Enhanced account security</Text>
          </View>
          <Switch
            value={twoFactorAuth}
            onValueChange={setTwoFactorAuth}
            trackColor={{ false: '#2A2A2A', true: '#4A9EFF' }}
            thumbColor={twoFactorAuth ? '#FFFFFF' : '#8B92A7'}
          />
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Session Timeout (Minutes)</Text>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.securityInputContainer}>
            <TextInput
              style={styles.securityInput}
              value={sessionTimeout}
              onChangeText={setSessionTimeout}
              keyboardType="numeric"
              placeholderTextColor="#8B92A7"
            />
          </LinearGradient>
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Password Expiry (days)</Text>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.securityInputContainer}>
            <TextInput
              style={styles.securityInput}
              value={passwordExpiry}
              onChangeText={setPasswordExpiry}
              keyboardType="numeric"
              placeholderTextColor="#8B92A7"
            />
          </LinearGradient>
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Max Login Attempts</Text>
          <LinearGradient colors={['#404040', '#000000', '#404040']} style={styles.securityInputContainer}>
            <TextInput
              style={styles.securityInput}
              value={maxLoginAttempts}
              onChangeText={setMaxLoginAttempts}
              keyboardType="numeric"
              placeholderTextColor="#8B92A7"
            />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
  
  const SystemInformation = () => (
    <View style={styles.detailScreen}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>System Information</Text>
      </View>
      <LinearGradient
        colors={['#666666', '#FFFFFF', '#666666']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleDivider}
      />
      
      <View style={styles.systemParentGrid}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>System Information</Text>
          <Text style={styles.infoValue}>OBEX v2.1.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Updated</Text>
          <Text style={styles.infoValue}>2025-11-18</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database Status</Text>
          <Text style={[styles.infoValue, styles.statusConnected]}>Connected</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>API Status</Text>
          <Text style={[styles.infoValue, styles.statusActive]}>Active</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Storage Used</Text>
          <Text style={styles.infoValue}>2.4GB / 10GB</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Uptime</Text>
          <Text style={styles.infoValue}>99.9%</Text>
        </View>
      </View>
    </View>
  );
  
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationPreferences />;
      case 'security':
        return <SecuritySettings />;
      case 'system':
        return <SystemInformation />;
      default:
        return <MainSettingsHub />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderCurrentScreen()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="apps" size={20} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Ionicons name="bar-chart" size={20} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="add" size={24} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="time" size={20} color="#8B92A7" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="settings" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  scrollView: {
    flex: 1,
  },
  // Main Hub Styles
  mainHub: {
    padding: 20,
    paddingTop: 60,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(0,255,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: '600',
  },
  navigationCards: {
    gap: 16,
    marginBottom: 40,
  },
  navCard: {
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555555',
  },
  navCardText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  // Detail Screen Styles
  detailScreen: {
    padding: 20,
    paddingTop: 60,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleDivider: {
    height: 2,
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  // Profile Settings Styles
  profileParentGrid: {
    backgroundColor: 'rgba(64,64,64,0.3)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  formFields: {
    gap: 20,
    marginBottom: 40,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  fieldInput: {
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555555',
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#4A9EFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  // Notification Preferences Styles
  notificationParentGrid: {
    backgroundColor: 'rgba(64,64,64,0.3)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#555555',
    gap: 20,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 16,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#8B92A7',
  },
  // Security Settings Styles
  securityParentGrid: {
    backgroundColor: 'rgba(64,64,64,0.3)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#555555',
    gap: 20,
  },
  securityInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#555555',
  },
  securityInput: {
    padding: 18,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  // System Information Styles
  systemParentGrid: {
    backgroundColor: 'rgba(64,64,64,0.3)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#555555',
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#8B92A7',
  },
  statusConnected: {
    color: '#00FF00',
  },
  statusActive: {
    color: '#00FF00',
  },
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingTop: 12,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    padding: 8,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: '#FFFFFF',
  },
  bottomPadding: {
    height: 100,
  },
});

export default SettingsScreen;