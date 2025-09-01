import React, { useState } from 'react';
import { User } from '../types/user';
import { Edit, Trash2, User as UserIcon, Calendar, Eye, EyeOff, Hash } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const maskPassword = (password?: string) => {
    if (!password) return '••••••••';
    return '*'.repeat(password.length);
  };

  const safeUsername = user?.username || 'Unknown User';
  const safePassword = user?.password || '';
  const safeId = user?.id || 'N/A';
  const safeCode = user?.code;
  const safeCreatedAt = user?.createdAt;

  if (!user) {
    return (
      <div className="bg-gray-900/50 border border-red-800 rounded-lg p-6">
        <div className="text-center text-red-400">
          <p>Error: User data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {safeUsername.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{safeUsername}</h3>
            <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-1">
              ID: {safeId}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-gray-400 hover:text-orange-400 hover:bg-gray-800 rounded-lg transition-colors"
            title="Edit user"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(safeId)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center text-gray-400">
          <UserIcon className="w-4 h-4 mr-2" />
          <span className="text-gray-300">Username:</span>
          <span className="ml-2 font-mono">{safeUsername}</span>
        </div>

        {/* Show code if available */}
        {safeCode && (
          <div className="flex items-center text-gray-400">
            <Hash className="w-4 h-4 mr-2" />
            <span className="text-gray-300">Code:</span>
            <span className="ml-2 font-mono text-orange-400">{safeCode}</span>
          </div>
        )}
        
        {/* Only show password if it exists */}
        {safePassword && (
          <div className="flex items-center text-gray-400">
            <div className="flex items-center">
              {showPassword ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              <span className="text-gray-300">Password:</span>
            </div>
            <div className="ml-2 flex items-center">
              <span className="font-mono">
                {showPassword ? safePassword : maskPassword(safePassword)}
              </span>
              <button
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-400 hover:text-gray-300 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        )}

        {safeCreatedAt && (
          <div className="flex items-center text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-gray-300">Created:</span>
            <span className="ml-2">{new Date(safeCreatedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;