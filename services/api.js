import { storage } from '../utils/storage';

const BASE_URL = 'https://obex-edge-backend.onrender.com/api/v1';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get authorization headers
  async getAuthHeaders() {
    const token = await storage.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Central request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const authHeaders = await this.getAuthHeaders();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('API Request:', url);
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }
      
      if (!response.ok) {
        throw this.normalizeError(data, response.status);
      }
      
      return data;
    } catch (error) {
      if (error.message && error.status) {
        throw error; // Already normalized
      }
      throw this.normalizeError({ message: error.message }, 0);
    }
  }

  // Normalize errors to consistent format
  normalizeError(errorData, status) {
    let message = 'An unexpected error occurred';
    
    switch (status) {
      case 401:
        message = 'Invalid email or password';
        break;
      case 409:
        message = 'Account already exists';
        break;
      case 422:
        message = errorData.detail || 'Invalid input data';
        break;
      case 0:
        message = 'Check your internet connection';
        break;
      default:
        message = errorData.message || errorData.detail || message;
    }
    
    return { message, status };
  }

  // Authentication endpoints
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // OTP endpoints (scaffolded)
  async generateOTP(data) {
    return this.request('/auth/otp/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyOTP(data) {
    return this.request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Camera endpoints
  async createCamera(cameraData) {
    return this.request('/cameras/create', {
      method: 'POST',
      body: JSON.stringify(cameraData),
    });
  }

  async getCameras() {
    return this.request('/cameras/');
  }

  async getCamera(cameraId) {
    return this.request(`/cameras/${cameraId}`);
  }

  async updateCamera(cameraId, cameraData) {
    return this.request(`/cameras/${cameraId}`, {
      method: 'PUT',
      body: JSON.stringify(cameraData),
    });
  }

  async deleteCamera(cameraId) {
    return this.request(`/cameras/${cameraId}`, {
      method: 'DELETE',
    });
  }

  // Alert endpoints
  async submitAlert(alertData) {
    return this.request('/alerts/submit', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async getRecentAlerts() {
    return this.request('/alerts/recent');
  }

  async getSupportedAlertTypes() {
    return this.request('/alerts/supported-types');
  }

  // Model logs endpoints
  async getModelLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/model-logs/${queryString ? '?' + queryString : ''}`);
  }

  async getModelLogById(logId) {
    return this.request(`/model-logs/${logId}`);
  }
}

export default new ApiService();