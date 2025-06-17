import React, { useState, useEffect } from 'react';
import { useApp } from '../../Context/AppContext';
import { generateId, ASSET_TYPES } from '../../utils';
import Button from '../UI/Button';

export default function AssetForm({ asset, onSuccess }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    customType: '',
    currentValue: '',
    dateAcquired: '',
    description: '',
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        type: ASSET_TYPES.includes(asset.type) ? asset.type : 'Other',
        customType: ASSET_TYPES.includes(asset.type) ? '' : asset.type,
        currentValue: asset.currentValue.toString(),
        dateAcquired: asset.dateAcquired ? new Date(asset.dateAcquired).toISOString().split('T')[0] : '',
        description: asset.description || '',
      });
    }
  }, [asset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const type = formData.type === 'Other' ? formData.customType : formData.type;
    
    const assetData = {
      id: asset?.id || generateId(),
      name: formData.name,
      type,
      currentValue: parseFloat(formData.currentValue),
      dateAcquired: formData.dateAcquired ? new Date(formData.dateAcquired) : undefined,
      description: formData.description || undefined,
      userId: state.user.id,
    };

    if (asset) {
      dispatch({ type: 'UPDATE_ASSET', payload: assetData });
    } else {
      dispatch({ type: 'ADD_ASSET', payload: assetData });
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
            Asset Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., Savings Account, Stock Portfolio"
          />
        </div>

        <div>
          <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-2">
            Current Value *
          </label>
          <input
            type="number"
            id="currentValue"
            name="currentValue"
            required
            step="0.01"
            min="0"
            value={formData.currentValue}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Asset Type *
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Select asset type</option>
            {ASSET_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dateAcquired" className="block text-sm font-medium text-gray-700 mb-2">
            Date Acquired
          </label>
          <input
            type="date"
            id="dateAcquired"
            name="dateAcquired"
            value={formData.dateAcquired}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      {formData.type === 'Other' && (
        <div>
          <label htmlFor="customType" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Asset Type *
          </label>
          <input
            type="text"
            id="customType"
            name="customType"
            required
            value={formData.customType}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter custom asset type"
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

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit">
          {asset ? 'Update Asset' : 'Add Asset'}
        </Button>
      </div>
    </form>
  );
}