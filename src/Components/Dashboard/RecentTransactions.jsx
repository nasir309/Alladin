import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../UI/Card';

export default function RecentTransactions() {
  const { state } = useApp();
  
  // Combine income and expenses, sort by date
  const allTransactions = [
    ...state.data.income.map(item => ({ ...item, type: 'income' })),
    ...state.data.expenses.map(item => ({ ...item, type: 'expense' }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      
      {allTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent transactions</p>
      ) : (
        <div className="space-y-3">
          {allTransactions.map((transaction, index) => (
            <div key={`${transaction.type}-${transaction.id || index}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {'source' in transaction ? transaction.source : transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}