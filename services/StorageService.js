import AsyncStorage from '@react-native-async-storage/async-storage';

export const CONFIG_KEYS = {
  FRPS_SERVER: 'frps_server_config',
  CAMERAS: 'camera_list',
  TUNNEL_STATUS: 'tunnel_status',
  APP_SETTINGS: 'app_settings'
};

class StorageService {
  
  // FRPS Server Configuration
  async saveFRPSConfig(config) {
    try {
      await AsyncStorage.setItem(CONFIG_KEYS.FRPS_SERVER, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Failed to save FRPS config:', error);
      return false;
    }
  }
  
  async loadFRPSConfig() {
    try {
      const config = await AsyncStorage.getItem(CONFIG_KEYS.FRPS_SERVER);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('Failed to load FRPS config:', error);
      return null;
    }
  }
  
  // Camera Management
  async saveCameras(cameras) {
    try {
      await AsyncStorage.setItem(CONFIG_KEYS.CAMERAS, JSON.stringify(cameras));
      return true;
    } catch (error) {
      console.error('Failed to save cameras:', error);
      return false;
    }
  }
  
  async loadCameras() {
    try {
      const cameras = await AsyncStorage.getItem(CONFIG_KEYS.CAMERAS);
      return cameras ? JSON.parse(cameras) : [];
    } catch (error) {
      console.error('Failed to load cameras:', error);
      return [];
    }
  }
  
  async addCamera(camera) {
    try {
      const cameras = await this.loadCameras();
      const newCamera = {
        id: camera.id || `cam_${Date.now()}`,
        name: camera.name,
        localIP: camera.localIP,
        localPort: camera.localPort || 554,
        remotePort: camera.remotePort,
        enabled: camera.enabled !== false,
        createdAt: new Date().toISOString()
      };
      
      cameras.push(newCamera);
      await this.saveCameras(cameras);
      return newCamera;
    } catch (error) {
      console.error('Failed to add camera:', error);
      return null;
    }
  }
  
  async updateCamera(cameraId, updates) {
    try {
      const cameras = await this.loadCameras();
      const index = cameras.findIndex(cam => cam.id === cameraId);
      
      if (index !== -1) {
        cameras[index] = { ...cameras[index], ...updates };
        await this.saveCameras(cameras);
        return cameras[index];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to update camera:', error);
      return null;
    }
  }
  
  async removeCamera(cameraId) {
    try {
      const cameras = await this.loadCameras();
      const filteredCameras = cameras.filter(cam => cam.id !== cameraId);
      await this.saveCameras(filteredCameras);
      return true;
    } catch (error) {
      console.error('Failed to remove camera:', error);
      return false;
    }
  }
  
  // Tunnel Status
  async saveTunnelStatus(status) {
    try {
      const statusData = {
        ...status,
        lastUpdated: new Date().toISOString()
      };
      await AsyncStorage.setItem(CONFIG_KEYS.TUNNEL_STATUS, JSON.stringify(statusData));
      return true;
    } catch (error) {
      console.error('Failed to save tunnel status:', error);
      return false;
    }
  }
  
  async loadTunnelStatus() {
    try {
      const status = await AsyncStorage.getItem(CONFIG_KEYS.TUNNEL_STATUS);
      return status ? JSON.parse(status) : { isActive: false };
    } catch (error) {
      console.error('Failed to load tunnel status:', error);
      return { isActive: false };
    }
  }
  
  // App Settings
  async saveAppSettings(settings) {
    try {
      await AsyncStorage.setItem(CONFIG_KEYS.APP_SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save app settings:', error);
      return false;
    }
  }
  
  async loadAppSettings() {
    try {
      const settings = await AsyncStorage.getItem(CONFIG_KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : {
        autoStart: false,
        notifications: true,
        logLevel: 'info'
      };
    } catch (error) {
      console.error('Failed to load app settings:', error);
      return {
        autoStart: false,
        notifications: true,
        logLevel: 'info'
      };
    }
  }
  
  // Utility Methods
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        CONFIG_KEYS.FRPS_SERVER,
        CONFIG_KEYS.CAMERAS,
        CONFIG_KEYS.TUNNEL_STATUS,
        CONFIG_KEYS.APP_SETTINGS
      ]);
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }
  
  async exportConfig() {
    try {
      const frpsConfig = await this.loadFRPSConfig();
      const cameras = await this.loadCameras();
      const settings = await this.loadAppSettings();
      
      return {
        frpsConfig,
        cameras,
        settings,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to export config:', error);
      return null;
    }
  }
  
  async importConfig(config) {
    try {
      if (config.frpsConfig) {
        await this.saveFRPSConfig(config.frpsConfig);
      }
      if (config.cameras) {
        await this.saveCameras(config.cameras);
      }
      if (config.settings) {
        await this.saveAppSettings(config.settings);
      }
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }
}

export default new StorageService();