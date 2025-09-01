import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import { 
  User, 
  CreateUserRequest, 
  ApiResponse, 
  CreateUserResponse, 
  UpdateUserResponse, 
  DeleteUserResponse,
  GetUsersResponse,
  ApiUser,
  transformApiUser,
  transformApiUsers
} from '../types/user';
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading users...');
      
      const response = await userService.getAllUsers() as GetUsersResponse;
      console.log('Raw API response:', response);

      let usersArray: User[] = [];

      if (response && typeof response === 'object') {
        if (Array.isArray(response.users)) {
          console.log('Found users array:', response.users);
          usersArray = transformApiUsers(response.users);
        } else if (Array.isArray(response.data)) {
          console.log('Found data array:', response.data);
          usersArray = transformApiUsers(response.data);
        } else if (Array.isArray(response)) {
          console.log('Response is array:', response);
          usersArray = transformApiUsers(response as ApiUser[]);
        } else {
          console.log('No users array found in response');
          usersArray = [];
        }
      } else if (Array.isArray(response)) {
        console.log('Direct array response:', response);
        usersArray = transformApiUsers(response);
      }

      console.log('Transformed users:', usersArray);
      setUsers(usersArray);
      setFilteredUsers(usersArray);

      if (response && typeof response === 'object' && !Array.isArray(response) && 'message' in response && (response as GetUsersResponse).message) {
        setSuccessMessage((response as GetUsersResponse).message ?? null);
        setTimeout(() => setSuccessMessage(null), 10000);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async (query: string) => {
  try {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    console.log('Searching users with query:', query);

    const response = await userService.searchUsers(query) as GetUsersResponse;
    console.log('Search users response:', response);

    let usersArray: User[] = [];

    if (response && typeof response === 'object') {
      if ('id' in response && 'message' in response) {
        const existingUser = users.find(user => user.id === response.id) || {
          id: response.id,
          username: response.username || 'Unknown User',
          code: query,
        };
        usersArray = [existingUser];
      } else if ('user' in response && response.user) {
        usersArray = [transformApiUser(response.user)];
      } else if ('data' in response && response.data) {
        usersArray = Array.isArray(response.data)
          ? transformApiUsers(response.data)
          : [transformApiUser(response.data)];
      } else if (('_id' in response || 'id' in response) && !Array.isArray(response)) {

        usersArray = [transformApiUser(response as ApiUser)];
      } else if (!Array.isArray(response) && Array.isArray((response as GetUsersResponse).users)) {
        usersArray = transformApiUsers((response as GetUsersResponse).users ?? []);
      } else if (!Array.isArray(response) && Array.isArray((response as GetUsersResponse).data)) {
        usersArray = transformApiUsers((response as GetUsersResponse).data ?? []);
      } else if (Array.isArray(response)) {
        usersArray = transformApiUsers(response);
      } else {
        usersArray = [];
      }
    } else if (Array.isArray(response)) {
      usersArray = transformApiUsers(response);
    }

    setFilteredUsers(usersArray);

    if (response && typeof response === 'object' && !Array.isArray(response) && 'message' in response && (response as GetUsersResponse).message) {
      setSuccessMessage((response as GetUsersResponse).message ?? null);
      setTimeout(() => setSuccessMessage(null), 10000); 
    }
  } catch (error: any) {
    console.error('Failed to search users:', error);
    setError(error.response?.data?.message || error.message || 'Failed to search users. Please try again.');
    setFilteredUsers([]);
  } finally {
    setLoading(false);
  }
};

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setFormLoading(true);
      setError(null);
      setSuccessMessage(null);
      console.log('Creating user:', userData);
      
      const response = await userService.createUser(userData) as CreateUserResponse;
      console.log('Create user response:', response);

      let newUser: User;
      let message: string = 'User created successfully!';

      if (response && typeof response === 'object') {
        if ('user' in response && response.user) {
          newUser = transformApiUser(response.user);
          message = response.message || message;
        } else if ('_id' in response) {
          newUser = transformApiUser(response as ApiUser);
        } else if ('data' in response && response.data) {
          newUser = transformApiUser(response.data);
          message = response.message || message;
        } else if ('id' in response && 'code' in response && 'message' in response) {
          newUser = {
            id: response.id,
            username: userData.username,
            code: response.code,
            password: userData.password,
            createdAt: new Date().toISOString(),
          };
          message = response.message ?? message;
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error('Invalid response format');
      }

      console.log('New user:', newUser);
      const currentUsers = Array.isArray(users) ? users : [];
      setUsers([...currentUsers, newUser]);
      setFilteredUsers([...currentUsers, newUser]);
      setShowForm(false);
      setEditingUser(null);
      setSuccessMessage(message);

      setTimeout(() => setSuccessMessage(null), 10000); 
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create user. Please try again.');
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
      setSuccessMessage(null);
      console.log('Updating user:', { ...userData, id: editingUser.id });
      
      const response = await userService.updateUser({
        ...userData,
        id: editingUser.id,
      }) as UpdateUserResponse;
      console.log('Update user response:', response);
      
      let updatedUser: User;
      let message: string = 'User updated successfully!';

      if (response && typeof response === 'object') {
        if ('user' in response && response.user) {
          updatedUser = transformApiUser(response.user);
          message = response.message || message;
        } else if ('_id' in response) {
          updatedUser = transformApiUser(response as ApiUser);
        } else if ('data' in response && response.data) {
          updatedUser = transformApiUser(response.data);
          message = response.message || message;
        } else if ('message' in response) {
          updatedUser = {
            ...editingUser,
            username: userData.username,
          };
          message = response.message ?? message;
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error('Invalid response format');
      }
      
      console.log('Updated user:', updatedUser);
      const currentUsers = Array.isArray(users) ? users : [];
      setUsers(currentUsers.map(user => user.id === editingUser.id ? updatedUser : user));
      setFilteredUsers(currentUsers.map(user => user.id === editingUser.id ? updatedUser : user));
      setEditingUser(null);
      setShowForm(false);
      setSuccessMessage(message);

      setTimeout(() => setSuccessMessage(null), 10000); 
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update user. Please try again.');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null);
        setSuccessMessage(null);
        console.log('Deleting user with id:', id);
        
        const response = await userService.deleteUser(id) ?? {};
        console.log('Delete user response:', response);

        const currentUsers = Array.isArray(users) ? users : [];
        setUsers(currentUsers.filter(user => user.id !== id));
        setFilteredUsers(currentUsers.filter(user => user.id !== id));

        let message = 'User deleted successfully!';
        if (typeof response === 'object' && response !== null && 'message' in response && (response as any).message) {
          message = (response as any).message;
        }

        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 10000);
      } catch (error: any) {
        console.error('Failed to delete user:', error);
        setError(error.response?.data?.message || error.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  const handleEditUser = (user: User) => {
    console.log('Editing user:', user);
    setEditingUser(user);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
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

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const handleRefreshUsers = async () => {
    await loadUsers();
  };

  return (
    <Layout
      onSearch={handleSearchUsers}
      onAddUser={handleAddUser}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onRefresh={handleRefreshUsers}
    >
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center justify-between">
          <span className="text-green-200">{successMessage}</span>
          <button
            onClick={clearSuccessMessage}
            className="text-green-200 hover:text-white"
            title="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

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