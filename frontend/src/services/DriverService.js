import api from './api';

class DriverService {
  // Add a new driver
  static async addDriver(driverData) {
    try {
      const response = await api.post('/drivers', driverData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update driver details
  static async updateDriver(id, updateData) {
    try {
      const response = await api.put(`/drivers/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single driver details
  static async getDriver(id) {
    try {
      const response = await api.get(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all drivers
  static async getAllDrivers() {
    try {
      const response = await api.get('/drivers');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper method to handle errors
  static handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        error: error.response.data.error
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 503,
        message: 'Service unavailable',
        error: 'No response received from server'
      };
    } else {
      // Error in request setup
      return {
        status: 500,
        message: 'Request failed',
        error: error.message
      };
    }
  }
}

export default DriverService;