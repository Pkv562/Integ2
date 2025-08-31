import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import { User, CreateUserRequest } from '../types/user';
import { userService } from '../services/userService';

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const currentUsers = Array.isArray(users) ? users : [];
    
    if (searchQuery.trim() === '') {
      setFilteredUsers(currentUsers);
    } else {
      const filtered = currentUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.getAllUsers();

      const usersArray = Array.isArray(fetchedUsers) ? fetchedUsers : [];
      setUsers(usersArray);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setFormLoading(true);
      setError(null);
      const newUser = await userService.createUser(userData);

      const currentUsers = Array.isArray(users) ? users : [];
      setUsers([...currentUsers, newUser]);
      setShowForm(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setError(error.response?.data?.message || 'Failed to create user. Please try again.');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (userData: CreateUserRequest) => {
    if (!editingUser) return;
    
    try {
      setFormLoading(true);
      setError(null);
      const updatedUser = await userService.updateUser({
        ...userData,
        id: editingUser.id,
      });
      
      const currentUsers = Array.isArray(users) ? users : [];
      setUsers(currentUsers.map(user => user.id === editingUser.id ? updatedUser : user));
      setEditingUser(null);
      setShowForm(false);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setError(error.response?.data?.message || 'Failed to update user. Please try again.');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null);
        await userService.deleteUser(id);
        
        const currentUsers = Array.isArray(users) ? users : [];
        setUsers(currentUsers.filter(user => user.id !== id));
      } catch (error: any) {
        console.error('Failed to delete user:', error);
        setError(error.response?.data?.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    setError(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setError(null);
  };

  const handleSubmitForm = async (userData: CreateUserRequest) => {
    try {
      if (editingUser) {
        await handleUpdateUser(userData);
      } else {
        await handleCreateUser(userData);
      }
    } catch (error) {
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <Layout
      onSearch={setSearchQuery}
      onAddUser={handleAddUser}
      searchQuery={searchQuery}
    >
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center justify-between">
          <span className="text-red-200">{error}</span>
          <button
            onClick={clearError}
            className="text-red-200 hover:text-white"
            title="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <UserList
        users={filteredUsers}
        loading={loading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <UserForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editingUser={editingUser}
        loading={formLoading}
      />
    </Layout>
  );
};

export default Home;