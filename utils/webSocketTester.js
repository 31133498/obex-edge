import WebSocketService from '../services/websocket';

class WebSocketTester {
  constructor() {
    this.testResults = [];
    this.isConnected = false;
  }

  async runWebSocketTests() {
    console.log('🔌 Starting WebSocket Tests...\n');
    
    return new Promise((resolve) => {
      // Set up event listeners
      WebSocketService.on('connected', () => {
        console.log('✅ WebSocket connected successfully');
        this.testResults.push({ test: 'Connection', status: 'PASS' });
        this.isConnected = true;
        
        // Send ping after connection
        setTimeout(() => {
          this.testPing();
        }, 1000);
      });

      WebSocketService.on('ping', () => {
        console.log('✅ Ping response received');
        this.testResults.push({ test: 'Ping Response', status: 'PASS' });
      });

      WebSocketService.on('alert', (alertData) => {
        console.log('✅ Alert received:', alertData);
        this.testResults.push({ 
          test: 'Alert Reception', 
          status: 'PASS',
          data: alertData 
        });
      });

      WebSocketService.on('error', (error) => {
        console.log('❌ WebSocket error:', error);
        this.testResults.push({ 
          test: 'Connection Error', 
          status: 'FAIL',
          error: error.message 
        });
      });

      WebSocketService.on('disconnected', () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnected = false;
      });

      // Start connection
      WebSocketService.connect();

      // Set timeout for test completion
      setTimeout(() => {
        this.printWebSocketResults();
        resolve(this.testResults);
      }, 10000); // 10 second timeout
    });
  }

  testPing() {
    if (this.isConnected) {
      console.log('📡 Sending ping...');
      WebSocketService.sendPing();
    }
  }

  printWebSocketResults() {
    console.log('\n📋 WebSocket Test Results:');
    console.log('==========================');
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.status}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.data) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2)}`);
      }
    });
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const total = this.testResults.length;
    
    console.log(`\nWebSocket Tests: ${passed}/${total} passed`);
    console.log('==========================\n');
  }

  // Method to simulate alert for testing
  simulateAlert() {
    const mockAlert = {
      event: 'alert',
      data: {
        alert_data: {
          confidence: 0.95,
          detections: [{
            confidence: 0.95,
            person_id: 'person_test_123',
            video_url: 'https://example.com/test_video.mp4'
          }],
          inference_type: 'face_recognition',
          video_url: 'https://example.com/test_video.mp4'
        },
        alert_type: 'face_detection_alert',
        device_id: 'camera-test-001',
        persist: true
      }
    };

    // Simulate receiving this alert
    WebSocketService.handleMessage(mockAlert);
  }
}

export default new WebSocketTester();