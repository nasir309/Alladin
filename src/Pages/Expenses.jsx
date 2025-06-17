import React, { useState } from 'react';
import { useApp } from '../Context/AppContext';
import { formatCurrency, formatDate } from '../utils';
import { Plus, Edit, Trash2, Filter, Search } from 'lucide-react';
import Button from '../Components/UI/Button';
import Card from '../Components/UI/Card';
import Modal from '../Components/UI/Modal';
import ExpenseForm from '../Components/Forms/ExpenseForm';

export default function Expenses() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredExpenses = state.data.expenses.filter(expense => {
    const matchesSearch = expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === '' || expense.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(state.data.expenses.map(expense => expense.category)));

  const handleAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and categorize your expenses</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
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
                placeholder="Search expenses..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No expense entries found</p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Expense
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredExpenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(expense => (
              <Card key={expense.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.category}</h3>
                        <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                        <p className="text-sm text-gray-500">{expense.paymentMethod}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(expense.amount)}
                        </p>
                        {expense.isRecurring && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Recurring ({expense.frequency})
                          </span>
                        )}
                      </div>
                    </div>
                    {expense.description && (
                      <p className="text-gray-600 mt-2">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
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
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        size="lg"
      >
        <ExpenseForm
          expense={editingExpense || undefined}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  );
}