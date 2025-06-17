import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useApp } from '../../Context/AppContext';
import { groupByCategory, calculateCategoryTotals, COLORS } from '../../utils';
import Card from '../UI/Card';

export default function AssetsChart() {
  const { state } = useApp();
  const groupedAssets = groupByCategory(state.data.assets, 'type');
  const chartData = calculateCategoryTotals(groupedAssets, 'currentValue');

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No assets data available</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-emerald-600">
            ${data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}