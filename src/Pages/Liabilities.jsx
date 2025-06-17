import React, { useState } from 'react';
import { useApp } from '../Context/AppContext';
import { formatCurrency, formatDate } from '../utils';
import { Plus, Edit, Trash2, Filter, Search, AlertTriangle } from 'lucide-react';
import Button from '../Components/UI/Button';
import Card from '../Components/UI/Card';
import Modal from '../Components/UI/Modal';
import LiabilityForm from '../Components/Forms/LiabilityForm';

export default function Liabilities() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLiability, setEditingLiability] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredLiabilities = state.data.liabilities.filter(liability => {
    const matchesSearch = liability.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liability.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === '' || liability.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const types = Array.from(new Set(state.data.liabilities.map(liability => liability.type)));
  const totalBalance = filteredLiabilities.reduce((sum, liability) => sum + liability.outstandingBalance, 0);

  // Check for upcoming due dates (within 7 days)
  const upcomingDues = state.data.liabilities.filter(liability => {
    if (!liability.dueDate) return false;
    const dueDate = new Date(liability.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff >= 0;
  });

  const handleAdd = () => {
    setEditingLiability(null);
    setIsModalOpen(true);
  };

  const handleEdit = (liability) => {
    setEditingLiability(liability);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this liability?')) {
      dispatch({ type: 'DELETE_LIABILITY', payload: id });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingLiability(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liabilities</h1>
          <p className="text-gray-600">Track your debts and payment obligations</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Liability
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="text-center">
          <p className="text-red-100 text-sm font-medium">Total Outstanding Balance</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalBalance)}</p>
        </div>
      </Card>

      {/* Upcoming Due Dates Alert */}
      {upcomingDues.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800">Upcoming Due Dates</h3>
              <div className="mt-2 space-y-1">
                {upcomingDues.map(liability => (
                  <p key={liability.id} className="text-sm text-orange-700">
                    {liability.name} - Due: {formatDate(liability.dueDate)}
                    {liability.minimumPayment && (
                      <span className="ml-2 font-medium">
                        Min Payment: {formatCurrency(liability.minimumPayment)}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Search liabilities..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Liabilities List */}
      {filteredLiabilities.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No liabilities found</p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Liability
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLiabilities
            .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
            .map(liability => (
              <Card key={liability.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{liability.name}</h3>
                        <p className="text-sm text-gray-500">{liability.type}</p>
                        {liability.dueDate && (
                          <p className="text-sm text-gray-500">Due: {formatDate(liability.dueDate)}</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(liability.outstandingBalance)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {liability.interestRate && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {liability.interestRate}% APR
                            </span>
                          )}
                          {liability.minimumPayment && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Min: {formatCurrency(liability.minimumPayment)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {liability.description && (
                      <p className="text-gray-600 mt-2">{liability.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(liability)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(liability.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLiability ? 'Edit Liability' : 'Add Liability'}
        size="lg"
      >
        <LiabilityForm
          liability={editingLiability || undefined}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  );
}