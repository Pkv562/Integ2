import React from 'react';
import { Search, Plus, Github, Twitter, Linkedin, RefreshCw } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  onAddUser: () => void;
  onRefresh?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, onAddUser, onRefresh, searchQuery, setSearchQuery }) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">USER MANAGER</h1>
              <nav className="hidden md:flex space-x-6">
                <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
                <button className="text-gray-300 hover:text-white transition-colors">Users</button>
                <button className="text-gray-300 hover:text-white transition-colors">Settings</button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex space-x-3">
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Manage Users
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Create, update, and manage user accounts with a beautiful interface
          </p>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" 
                onClick={handleSearchClick}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  title="Refresh users from server"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="ml-2 hidden sm:inline">Refresh</span>
                </button>
              )}
              <button
                type="button"
                onClick={onAddUser}
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </form>
        </div>

        {children}
      </main>
    </div>
  );
};

export default Layout;