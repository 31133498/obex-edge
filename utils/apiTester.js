import ApiService from '../services/api';
import { storage } from '../utils/storage';

class ApiTester {
  constructor() {
    this.results = {};
  }

  async runAllTests() {
    console.log('🚀 Starting API Integration Tests...\n');
    
    try {
      // Step 1: Test Authentication
      await this.testAuthentication();
      
      // Step 2: Test Camera Endpoints
      await this.testCameraEndpoints();
      
      // Step 3: Test Alert Endpoints
      await this.testAlertEndpoints();
      
      // Step 4: Test Model Logs
      await this.testModelLogs();
      
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testAuthentication() {
    console.log('🔐 Testing Authentication Endpoints...');
    
    try {
      // Test Login
      const loginResponse = await ApiService.login({
        email: 'sannishazily@gmail.com',
        password: '#Shazily123'
      });
      
      this.results.login = {
        status: '✅ PASS',
        response: loginResponse,
        token: loginResponse.access_token ? 'Token received' : 'No token'
      };
      
      console.log('✅ Login successful');
      
      // Store token for subsequent tests
      if (loginResponse.access_token) {
        await storage.setToken(loginResponse.access_token);
      }
      
    } catch (error) {
      this.results.login = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Login failed:', error.message);
    }
  }

  async testCameraEndpoints() {
    console.log('\n📹 Testing Camera Endpoints...');
    
    // Test Create Camera
    try {
      const createResponse = await ApiService.createCamera({
        name: 'Test Camera API',
        rtsp_url: 'rtsp://admin:Admin1234@staging.ai.avzdax.com:557/1/1',
        location: 'Test Location',
        is_active: true
      });
      
      this.results.createCamera = {
        status: '✅ PASS',
        response: createResponse
      };
      console.log('✅ Create camera successful');
      
      // Store camera ID for other tests
      this.testCameraId = createResponse.id || createResponse.camera_id;
      
    } catch (error) {
      this.results.createCamera = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Create camera failed:', error.message);
    }

    // Test Get All Cameras
    try {
      const camerasResponse = await ApiService.getCameras();
      
      this.results.getCameras = {
        status: '✅ PASS',
        count: Array.isArray(camerasResponse) ? camerasResponse.length : 
               (camerasResponse.cameras ? camerasResponse.cameras.length : 'Unknown'),
        response: camerasResponse
      };
      console.log('✅ Get cameras successful');
      
    } catch (error) {
      this.results.getCameras = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Get cameras failed:', error.message);
    }

    // Test Get Single Camera (if we have an ID)
    if (this.testCameraId) {
      try {
        const cameraResponse = await ApiService.getCamera(this.testCameraId);
        
        this.results.getCamera = {
          status: '✅ PASS',
          response: cameraResponse
        };
        console.log('✅ Get single camera successful');
        
      } catch (error) {
        this.results.getCamera = {
          status: '❌ FAIL',
          error: error.message
        };
        console.log('❌ Get single camera failed:', error.message);
      }

      // Test Update Camera
      try {
        const updateResponse = await ApiService.updateCamera(this.testCameraId, {
          name: 'Updated Test Camera',
          location: 'Updated Location'
        });
        
        this.results.updateCamera = {
          status: '✅ PASS',
          response: updateResponse
        };
        console.log('✅ Update camera successful');
        
      } catch (error) {
        this.results.updateCamera = {
          status: '❌ FAIL',
          error: error.message
        };
        console.log('❌ Update camera failed:', error.message);
      }

      // Test Delete Camera
      try {
        const deleteResponse = await ApiService.deleteCamera(this.testCameraId);
        
        this.results.deleteCamera = {
          status: '✅ PASS',
          response: deleteResponse
        };
        console.log('✅ Delete camera successful');
        
      } catch (error) {
        this.results.deleteCamera = {
          status: '❌ FAIL',
          error: error.message
        };
        console.log('❌ Delete camera failed:', error.message);
      }
    }
  }

  async testAlertEndpoints() {
    console.log('\n🚨 Testing Alert Endpoints...');
    
    // Test Submit Alert
    try {
      const alertResponse = await ApiService.submitAlert({
        alert_type: 'face_detection_alert',
        device_id: 'camera-001',
        confidence: 0.95,
        alert_data: {
          inference_type: 'face_recognition',
          detections: [{
            confidence: 0.95,
            person_id: 'person_123'
          }]
        }
      });
      
      this.results.submitAlert = {
        status: '✅ PASS',
        response: alertResponse
      };
      console.log('✅ Submit alert successful');
      
    } catch (error) {
      this.results.submitAlert = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Submit alert failed:', error.message);
    }

    // Test Get Recent Alerts
    try {
      const recentAlertsResponse = await ApiService.getRecentAlerts();
      
      this.results.getRecentAlerts = {
        status: '✅ PASS',
        count: Array.isArray(recentAlertsResponse) ? recentAlertsResponse.length : 'Unknown',
        response: recentAlertsResponse
      };
      console.log('✅ Get recent alerts successful');
      
    } catch (error) {
      this.results.getRecentAlerts = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Get recent alerts failed:', error.message);
    }

    // Test Get Supported Alert Types
    try {
      const alertTypesResponse = await ApiService.getSupportedAlertTypes();
      
      this.results.getSupportedAlertTypes = {
        status: '✅ PASS',
        response: alertTypesResponse
      };
      console.log('✅ Get supported alert types successful');
      
    } catch (error) {
      this.results.getSupportedAlertTypes = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Get supported alert types failed:', error.message);
    }
  }

  async testModelLogs() {
    console.log('\n📊 Testing Model Log Endpoints...');
    
    // Test Get Model Logs
    try {
      const modelLogsResponse = await ApiService.getModelLogs();
      
      this.results.getModelLogs = {
        status: '✅ PASS',
        response: modelLogsResponse
      };
      console.log('✅ Get model logs successful');
      
    } catch (error) {
      this.results.getModelLogs = {
        status: '❌ FAIL',
        error: error.message
      };
      console.log('❌ Get model logs failed:', error.message);
    }
  }

  printResults() {
    console.log('\n📋 API Test Results Summary:');
    console.log('================================');
    
    Object.entries(this.results).forEach(([endpoint, result]) => {
      console.log(`${endpoint}: ${result.status}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    });
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.status.includes('✅')).length;
    
    console.log(`\nTotal: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
    console.log('================================\n');
  }
}

export default new ApiTester();