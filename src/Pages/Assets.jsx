import React, { useState } from 'react';
import { useApp } from '../Context/AppContext';
import { formatCurrency, formatDate } from '../utils';
import { Plus, Edit, Trash2, Filter, Search } from 'lucide-react';
import Button from '../Components/UI/Button';
import Card from '../Components/UI/Card';
import Modal from '../Components/UI/Modal';
import AssetForm from '../Components/Forms/AssetForm';

export default function Assets() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredAssets = state.data.assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === '' || asset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const types = Array.from(new Set(state.data.assets.map(asset => asset.type)));
  const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.currentValue, 0);

  const handleAdd = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      dispatch({ type: 'DELETE_ASSET', payload: id });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage your valuable assets and investments</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Total Value Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="text-center">
          <p className="text-blue-100 text-sm font-medium">Total Asset Value</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalValue)}</p>
        </div>
      </Card>

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
                placeholder="Search assets..."
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

      {/* Assets List */}
      {filteredAssets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No assets found</p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Asset
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssets
            .sort((a, b) => b.currentValue - a.currentValue)
            .map(asset => (
              <Card key={asset.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                        <p className="text-sm text-gray-500">{asset.type}</p>
                        {asset.dateAcquired && (
                          <p className="text-sm text-gray-500">Acquired: {formatDate(asset.dateAcquired)}</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(asset.currentValue)}
                        </p>
                      </div>
                    </div>
                    {asset.description && (
                      <p className="text-gray-600 mt-2">{asset.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(asset)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
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
        title={editingAsset ? 'Edit Asset' : 'Add Asset'}
        size="lg"
      >
        <AssetForm
          asset={editingAsset || undefined}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  );
}