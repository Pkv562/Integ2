import React from 'react';
import { User } from '../types/user';
import UserCard from './UserCard';
import { Users as UsersIcon, Loader2 } from 'lucide-react';

interface UserListProps {
  users: User[];
  loading: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users = [], loading, onEditUser, onDeleteUser }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading users...</p>
      </div>
    );
  }

  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <UsersIcon className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
          <p className="text-gray-500 max-w-sm">
            Get started by creating your first user account using the "Add User" button above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
        />
      ))}
    </div>
  );
};

export default UserList;