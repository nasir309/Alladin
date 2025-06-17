import React from 'react';
import { useApp } from '../Context/AppContext';
import { calculateTotalIncome, calculateTotalExpenses, formatCurrency } from '../utils';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import NetWorthCard from '../Components/Dashboard/NetworthCard';
import StatsCard from '../Components/Dashboard/StatsCard';
import AssetsChart from '../Components/Dashboard/AssetsChart';
import IncomeExpenseChart from '../Components/Dashboard/IncomeExpenseChart';
import RecentTransactions from '../Components/Dashboard/RecentTransactions';

export default function Dashboard() {
  const { state } = useApp();
  
  const totalIncome = calculateTotalIncome(state.data.income);
  const totalExpenses = calculateTotalExpenses(state.data.expenses);
  const totalAssets = state.data.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalLiabilities = state.data.liabilities.reduce((sum, liability) => sum + liability.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Net Worth Card */}
      <NetWorthCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="h-6 w-6" />}
          color="red"
        />
        <StatsCard
          title="Total Assets"
          value={formatCurrency(totalAssets)}
          icon={<PiggyBank className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Liabilities"
          value={formatCurrency(totalLiabilities)}
          icon={<DollarSign className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetsChart />
        <IncomeExpenseChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}