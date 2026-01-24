import ApiService from './api';
import { storage } from '../utils/storage';

class AuthService {
  // Register user
  async signup(userData) {
    try {
      const payload = {
        username: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        confirmPassword: userData.confirmPassword || userData.password,
        organizationName: userData.organizationName,
        organizationId: userData.organizationId,
        role: userData.role,
        companyRole: userData.companyRole,
        isAdmin: userData.isAdmin || false,
      };
      
      const response = await ApiService.signup(payload);
      
      // Store user data if returned
      if (response.user) {
        await storage.setUserData(response.user);
      }
      
      // Only store token if backend returns one
      if (response.access_token) {
        await storage.setToken(response.access_token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await ApiService.login(credentials);
      
      // Store token and user data
      if (response.access_token) {
        await storage.setToken(response.access_token);
      }
      
      if (response.user_id || response.organization_id) {
        const userData = {
          user_id: response.user_id,
          organization_id: response.organization_id,
          email: credentials.email,
        };
        await storage.setUserData(userData);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await storage.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear storage even if there's an error
      await storage.clearAuthData();
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await storage.getToken();
    return !!token;
  }

  // Get current user data
  async getCurrentUser() {
    return await storage.getUserData();
  }

  // Get current token
  async getToken() {
    return await storage.getToken();
  }

  // Restore session from storage
  async restoreSession() {
    try {
      const token = await storage.getToken();
      const userData = await storage.getUserData();
      
      if (token && userData) {
        return { token, user: userData };
      }
      
      return null;
    } catch (error) {
      console.error('Error restoring session:', error);
      return null;
    }
  }
}

export default new AuthService();