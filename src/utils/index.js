import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

export function calculateNetWorth(assets, liabilities) {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.outstandingBalance, 0);
  return totalAssets - totalLiabilities;
}

export function calculateTotalIncome(income) {
  return income.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateTotalExpenses(expenses) {
  return expenses.reduce((sum, item) => sum + item.amount, 0);
}

export function groupByCategory(items, key) {
  return items.reduce((groups, item) => {
    const groupKey = item[key] || 'Other';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
}

export function calculateCategoryTotals(groupedItems, valueKey) {
  return Object.entries(groupedItems).map(([category, items]) => ({
    name: category,
    value: items.reduce((sum, item) => sum + (item[valueKey] || 0), 0),
  }));
}

export function getRecentMonths(count) {
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    months.push(subMonths(new Date(), i));
  }
  return months;
}

export function filterByDateRange(items, startDate, endDate) {
  return items.filter(item => {
    const itemDate = typeof item.date === 'string' ? parseISO(item.date) : item.date;
    return itemDate >= startDate && itemDate <= endDate;
  });
}

export function generateTimeSeriesData(income, expenses, months = 6) {
  const monthsArray = getRecentMonths(months);
  
  const incomeData = monthsArray.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthIncome = filterByDateRange(income, monthStart, monthEnd);
    
    return {
      date: format(month, 'MMM yyyy'),
      value: calculateTotalIncome(monthIncome),
    };
  });

  const expenseData = monthsArray.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthExpenses = filterByDateRange(expenses, monthStart, monthEnd);
    
    return {
      date: format(month, 'MMM yyyy'),
      value: calculateTotalExpenses(monthExpenses),
    };
  });

  return { incomeData, expenseData };
}

export const COLORS = {
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#8B5CF6',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  chart: [
    '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
    '#22C55E', '#EC4899', '#F97316', '#06B6D4', '#84CC16'
  ]
};

export const EXPENSE_CATEGORIES = [
  'Groceries', 'Rent', 'Utilities', 'Transportation', 'Entertainment',
  'Dining Out', 'Healthcare', 'Shopping', 'Education', 'Insurance', 'Other'
];

export const INCOME_SOURCES = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Bonus', 'Other'
];

export const ASSET_TYPES = [
  'Cash', 'Savings Account', 'Investment', 'Real Estate', 'Vehicle', 'Other'
];

export const LIABILITY_TYPES = [
  'Credit Card', 'Student Loan', 'Mortgage', 'Car Loan', 'Personal Loan', 'Other'
];

export const PAYMENT_METHODS = [
  'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check', 'Other'
];