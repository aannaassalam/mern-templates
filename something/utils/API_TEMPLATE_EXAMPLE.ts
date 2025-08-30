/**
 * Example of how to implement enhanced error handling in new API files
 *
 * This template shows the recommended pattern for creating new API files
 * with consistent error handling and toast notifications.
 */

import { handleApiError, handleApiSuccess } from '@/utils/apiErrorHandler';

import axiosInstance from '../api/axiosInstance';

// Example interface for your data
interface ExampleData {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

interface ExampleResponse {
  status: number;
  message: string;
  data: ExampleData;
}

interface CustomOperationData {
  [key: string]: unknown;
}

// Example API implementation with enhanced error handling
export const exampleAPI = {
  // Create operation
  create: async (data: Partial<ExampleData>): Promise<ExampleResponse> => {
    try {
      const response = await axiosInstance.post('/api/v1/example', data);

      // Show success toast automatically
      handleApiSuccess('Item created successfully');

      return response.data;
    } catch (error) {
      // Show error toast automatically with API message or fallback
      handleApiError(error, 'Failed to create item');
      throw error;
    }
  },

  // Read operation (get all)
  getAll: async (
    page = 1,
    limit = 10,
    search?: string
  ): Promise<ExampleResponse[]> => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (search && search.trim()) {
        query += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await axiosInstance.get(`/api/v1/example${query}`);

      // Note: Usually no success toast for read operations
      // handleApiSuccess('Items fetched successfully');

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch items');
      throw error;
    }
  },

  // Read operation (get by ID)
  getById: async (id: string): Promise<ExampleResponse> => {
    try {
      const response = await axiosInstance.get(`/api/v1/example/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch item details');
      throw error;
    }
  },

  // Update operation
  update: async (
    id: string,
    data: Partial<ExampleData>
  ): Promise<ExampleResponse> => {
    try {
      const response = await axiosInstance.patch(`/api/v1/example/${id}`, data);

      // Show success toast automatically
      handleApiSuccess('Item updated successfully');

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update item');
      throw error;
    }
  },

  // Delete operation
  delete: async (id: string): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.delete(`/api/v1/example/${id}`);

      // Show success toast automatically
      handleApiSuccess('Item deleted successfully');

      return {
        status: response.status || 200,
        message: response.data?.message || 'Item deleted successfully',
      };
    } catch (error) {
      handleApiError(error, 'Failed to delete item');
      throw error;
    }
  },

  // Custom operation example
  customOperation: async (
    id: string,
    customData: CustomOperationData
  ): Promise<ExampleResponse> => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/example/${id}/custom`,
        customData
      );

      // Use API response message if available, otherwise custom message
      const successMessage =
        response.data?.message || 'Custom operation completed successfully';
      handleApiSuccess(successMessage);

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to perform custom operation');
      throw error;
    }
  },
};

/**
 * Usage in Components:
 *
 * const handleCreateItem = async (formData) => {
 *   try {
 *     const result = await exampleAPI.create(formData);
 *     // Success toast is automatically shown
 *     // Handle success logic (redirect, refresh, etc.)
 *   } catch (error) {
 *     // Error toast is automatically shown with API message
 *     // Handle error logic if needed
 *   }
 * };
 *
 * Key Points:
 * 1. Always wrap API calls in try-catch blocks
 * 2. Use handleApiSuccess() for successful operations that need user feedback
 * 3. Use handleApiError() for error handling (it will show the API message if available)
 * 4. Don't manually show toast notifications for common CRUD operations
 * 5. The API layer handles all toast notifications automatically
 * 6. Components focus on business logic, not error message formatting
 */

export {};
