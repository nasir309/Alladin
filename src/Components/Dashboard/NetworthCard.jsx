import React from 'react';
import { useApp } from '../../Context/AppContext';
import { calculateNetWorth, formatCurrency } from '../../utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../UI/Card';

export default function NetWorthCard() {
  const { state } = useApp();
  const netWorth = calculateNetWorth(state.data.assets, state.data.liabilities);
  const isPositive = netWorth >= 0;

  return (
    <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-100 text-sm font-medium">Net Worth</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(netWorth)}</p>
        </div>
        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
          {isPositive ? (
            <TrendingUp className="h-8 w-8" />
          ) : (
            <TrendingDown className="h-8 w-8" />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-emerald-100">
        <span>Total Assets - Total Liabilities</span>
      </div>
    </Card>
  );
}