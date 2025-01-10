import api from './api';

class RouteService {
  // Create a new route
  static async createRoute(routeData) {
    try {
      const response = await api.post('/routes', routeData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update route
  static async updateRoute(id, updateData) {
    try {
      const response = await api.put(`/routes/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single route details
  static async getRoute(id) {
    try {
      const response = await api.get(`/routes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all routes
  static async getAllRoutes() {
    try {
      const response = await api.get('/routes');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validate stops data
  static validateStops(stops) {
    if (!Array.isArray(stops) || stops.length === 0) {
      throw new Error('Stops must be a non-empty array');
    }

    stops.forEach((stop, index) => {
      if (!stop.stop || !stop.lng || !stop.lat || !stop.sequence) {
        throw new Error(`Invalid stop data at index ${index}. All stops must have stop name, longitude, latitude, and sequence.`);
      }
    });

    return true;
  }

  // Helper method to handle errors
  static handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || error.response.data.error || 'An error occurred',
        error: error.response.data.error
      };
    } else if (error.request) {
      return {
        status: 503,
        message: 'Service unavailable',
        error: 'No response received from server'
      };
    } else {
      return {
        status: 500,
        message: 'Request failed',
        error: error.message
      };
    }
  }
}

export default RouteService;