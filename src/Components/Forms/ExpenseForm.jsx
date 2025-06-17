import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils';
import Button from '../UI/Button';

export default function ExpenseForm({ expense, onSuccess }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    customCategory: '',
    paymentMethod: '',
    customPaymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    frequency: 'monthly',
    endDate: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: EXPENSE_CATEGORIES.includes(expense.category) ? expense.category : 'Other',
        customCategory: EXPENSE_CATEGORIES.includes(expense.category) ? '' : expense.category,
        paymentMethod: PAYMENT_METHODS.includes(expense.paymentMethod) ? expense.paymentMethod : 'Other',
        customPaymentMethod: PAYMENT_METHODS.includes(expense.paymentMethod) ? '' : expense.paymentMethod,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description || '',
        isRecurring: expense.isRecurring,
        frequency: expense.frequency || 'monthly',
        endDate: expense.endDate ? new Date(expense.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const category = formData.category === 'Other' ? formData.customCategory : formData.category;
    const paymentMethod = formData.paymentMethod === 'Other' ? formData.customPaymentMethod : formData.paymentMethod;
    
    const expenseData = {
      id: expense?.id || generateId(),
      amount: parseFloat(formData.amount),
      category,
      paymentMethod,
      date: new Date(formData.date),
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : undefined,
      endDate: formData.isRecurring && formData.endDate ? new Date(formData.endDate) : undefined,
      userId: state.user.id,
    };

    if (expense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expenseData });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Select a category</option>
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method *
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            required
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Select payment method</option>
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.category === 'Other' && (
        <div>
          <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Category *
          </label>
          <input
            type="text"
            id="customCategory"
            name="customCategory"
            required
            value={formData.customCategory}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter custom category"
          />
        </div>
      )}

      {formData.paymentMethod === 'Other' && (
        <div>
          <label htmlFor="customPaymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Payment Method *
          </label>
          <input
            type="text"
            id="customPaymentMethod"
            name="customPaymentMethod"
            required
            value={formData.customPaymentMethod}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter custom payment method"
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
            This is a recurring expense
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
          {expense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}