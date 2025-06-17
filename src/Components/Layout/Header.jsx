import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../Context/AppContext';
import { LogOut, User, TrendingUp } from 'lucide-react';

export default function Header() {
  const { state, dispatch } = useApp();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ALLADIN</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/income"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/income') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Income
            </Link>
            <Link
              to="/expenses"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/expenses') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Expenses
            </Link>
            <Link
              to="/assets"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/assets') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Assets
            </Link>
            <Link
              to="/liabilities"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/liabilities') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Liabilities
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{state.user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 py-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/') 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/income"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/income') 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Income
          </Link>
          <Link
            to="/expenses"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/expenses') 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Expenses
          </Link>
          <Link
            to="/assets"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/assets') 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Assets
          </Link>
          <Link
            to="/liabilities"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/liabilities') 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Liabilities
          </Link>
        </div>
      </div>
    </header>
  );
}