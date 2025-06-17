import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId, LIABILITY_TYPES } from '../../utils';
import Button from '../UI/Button';

export default function LiabilityForm({ liability, onSuccess }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    customType: '',
    outstandingBalance: '',
    originalAmount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    description: '',
  });

  useEffect(() => {
    if (liability) {
      setFormData({
        name: liability.name,
        type: LIABILITY_TYPES.includes(liability.type) ? liability.type : 'Other',
        customType: LIABILITY_TYPES.includes(liability.type) ? '' : liability.type,
        outstandingBalance: liability.outstandingBalance.toString(),
        originalAmount: liability.originalAmount?.toString() || '',
        interestRate: liability.interestRate?.toString() || '',
        minimumPayment: liability.minimumPayment?.toString() || '',
        dueDate: liability.dueDate ? new Date(liability.dueDate).toISOString().split('T')[0] : '',
        description: liability.description || '',
      });
    }
  }, [liability]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const type = formData.type === 'Other' ? formData.customType : formData.type;
    
    const liabilityData = {
      id: liability?.id || generateId(),
      name: formData.name,
      type,
      outstandingBalance: parseFloat(formData.outstandingBalance),
      originalAmount: formData.originalAmount ? parseFloat(formData.originalAmount) : undefined,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      minimumPayment: formData.minimumPayment ? parseFloat(formData.minimumPayment) : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      description: formData.description || undefined,
      userId: state.user.id,
    };

    if (liability) {
      dispatch({ type: 'UPDATE_LIABILITY', payload: liabilityData });
    } else {
      dispatch({ type: 'ADD_LIABILITY', payload: liabilityData });
    }

    onSuccess();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Liability Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., Credit Card, Student Loan"
          />
        </div>

        <div>
          <label htmlFor="outstandingBalance" className="block text-sm font-medium text-gray-700 mb-2">
            Outstanding Balance *
          </label>
          <input
            type="number"
            id="outstandingBalance"
            name="outstandingBalance"
            required
            step="0.01"
            min="0"
            value={formData.outstandingBalance}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Liability Type *
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Select liability type</option>
            {LIABILITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Original Amount
          </label>
          <input
            type="number"
            id="originalAmount"
            name="originalAmount"
            step="0.01"
            min="0"
            value={formData.originalAmount}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>
      </div>

      {formData.type === 'Other' && (
        <div>
          <label htmlFor="customType" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Liability Type *
          </label>
          <input
            type="text"
            id="customType"
            name="customType"
            required
            value={formData.customType}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter custom liability type"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            step="0.01"
            min="0"
            max="100"
            value={formData.interestRate}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="minimumPayment" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Payment
          </label>
          <input
            type="number"
            id="minimumPayment"
            name="minimumPayment"
            step="0.01"
            min="0"
            value={formData.minimumPayment}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

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

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit">
          {liability ? 'Update Liability' : 'Add Liability'}
        </Button>
      </div>
    </form>
  );
}