import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId, INCOME_SOURCES } from '../../utils';
import Button from '../UI/Button';

export default function IncomeForm({ income, onSuccess }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    customSource: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    frequency: 'monthly',
    endDate: '',
  });

  useEffect(() => {
    if (income) {
      setFormData({
        amount: income.amount.toString(),
        source: INCOME_SOURCES.includes(income.source) ? income.source : 'Other',
        customSource: INCOME_SOURCES.includes(income.source) ? '' : income.source,
        date: new Date(income.date).toISOString().split('T')[0],
        description: income.description || '',
        isRecurring: income.isRecurring,
        frequency: income.frequency || 'monthly',
        endDate: income.endDate ? new Date(income.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [income]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const source = formData.source === 'Other' ? formData.customSource : formData.source;
    
    const incomeData = {
      id: income?.id || generateId(),
      amount: parseFloat(formData.amount),
      source,
      date: new Date(formData.date),
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : undefined,
      endDate: formData.isRecurring && formData.endDate ? new Date(formData.endDate) : undefined,
      userId: state.user.id,
    };

    if (income) {
      dispatch({ type: 'UPDATE_INCOME', payload: incomeData });
    } else {
      dispatch({ type: 'ADD_INCOME', payload: incomeData });
    }

    onSuccess();
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
          Source *
        </label>
        <select
          id="source"
          name="source"
          required
          value={formData.source}
          onChange={handleChange}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">Select a source</option>
          {INCOME_SOURCES.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      {formData.source === 'Other' && (
        <div>
          <label htmlFor="customSource" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Source *
          </label>
          <input
            type="text"
            id="customSource"
            name="customSource"
            required
            value={formData.customSource}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter custom source"
          />
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Optional description..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
            This is a recurring income
          </label>
        </div>

        {formData.isRecurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit">
          {income ? 'Update Income' : 'Add Income'}
        </Button>
      </div>
    </form>
  );
}