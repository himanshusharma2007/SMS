import api from "./api";

export class VehicleHistoryservice {
  static async addVehicleHistory(historyData) {
    try {
      const response = await api.post("/vehicle-history", historyData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async updateVehicleHistoryStop(updateData) {
    try {
      const response = await api.put("/vehicle-history", updateData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static handleError(error) {
    if (error.response) {
      
      if (error.response.status === 403) {
        throw new Error("You are not authorized to perform this action");
      }
      if (error.response.status === 404) {
        throw new Error(error.response.data.message || "Resource not found");
      }

      const message =
        error.response.data.error ||
        error.response.data.message ||
        "An error occurred";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Error setting up request");
    }
  }
}
