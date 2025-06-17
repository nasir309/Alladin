import React, { useState } from 'react';
import { useApp } from '../Context/AppContext';
import { formatCurrency, formatDate } from '../utils';
import { Plus, Edit, Trash2, Filter, Search } from 'lucide-react';
import Button from '../Components/UI/Button';
import Card from '../Components/UI/Card';
import Modal from '../Components/UI/Modal';
import IncomeForm from '../Components/Forms/IncomeForm';

export default function Income() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('');

  const filteredIncome = state.data.income.filter(income => {
    const matchesSearch = income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSource === '' || income.source === filterSource;
    return matchesSearch && matchesFilter;
  });

  const sources = Array.from(new Set(state.data.income.map(income => income.source)));

  const handleAdd = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      dispatch({ type: 'DELETE_INCOME', payload: id });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600">Track and manage your income sources</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

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
                placeholder="Search income..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filterSource" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Source
            </label>
            <select
              id="filterSource"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearchTerm('');
                setFilterSource('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Income List */}
      {filteredIncome.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No income entries found</p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Income
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredIncome
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(income => (
              <Card key={income.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{income.source}</h3>
                        <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(income.amount)}
                        </p>
                        {income.isRecurring && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Recurring ({income.frequency})
                          </span>
                        )}
                      </div>
                    </div>
                    {income.description && (
                      <p className="text-gray-600 mt-2">{income.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(income)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(income.id)}
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
        title={editingIncome ? 'Edit Income' : 'Add Income'}
        size="lg"
      >
        <IncomeForm
          income={editingIncome || undefined}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  );
}