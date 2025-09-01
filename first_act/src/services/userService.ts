import axios from 'axios';
import { User, CreateUserRequest, UpdateUserRequest, GetUsersResponse } from '../types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_LINK || process.env.API_LINK;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isCode = (query: string): boolean => {
  return query.length === 6 && /^[A-Z0-9]+$/.test(query);
};

const isId = (query: string): boolean => {
  return query.length === 24 && /^[0-9a-f]+$/.test(query);
};

export const userService = {
  getAllUsers: async (): Promise<GetUsersResponse> => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userData: UpdateUserRequest): Promise<User> => {
    try {
      const payload = { username: userData.username };
      const response = await api.patch(`/users/${userData.id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  searchUsers: async (query: string): Promise<GetUsersResponse> => {
    try {
      let response;
      if (isCode(query) || isId(query)) {
        response = await api.get(`/users/${encodeURIComponent(query)}`);
      } else {
        response = await api.get(`/users?search=${encodeURIComponent(query)}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },
};