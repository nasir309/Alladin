
export const createUser = (id, email, name, createdAt) => ({
  id,
  email,
  name,
  createdAt
});

export const createIncome = (id, amount, source, date, userId, options = {}) => ({
  id,
  amount,
  source,
  date,
  description: options.description,
  isRecurring: options.isRecurring || false,
  frequency: options.frequency,
  endDate: options.endDate,
  userId
});

export const createExpense = (id, amount, category, date, paymentMethod, userId, options = {}) => ({
  id,
  amount,
  category,
  date,
  paymentMethod,
  description: options.description,
  isRecurring: options.isRecurring || false,
  frequency: options.frequency,
  endDate: options.endDate,
  userId
});

export const createAsset = (id, name, type, currentValue, userId, options = {}) => ({
  id,
  name,
  type,
  currentValue,
  dateAcquired: options.dateAcquired,
  description: options.description,
  userId
});

export const createLiability = (id, name, type, outstandingBalance, userId, options = {}) => ({
  id,
  name,
  type,
  outstandingBalance,
  originalAmount: options.originalAmount,
  interestRate: options.interestRate,
  minimumPayment: options.minimumPayment,
  dueDate: options.dueDate,
  description: options.description,
  userId
});

export const createFinancialData = () => ({
  income: [],
  expenses: [],
  assets: [],
  liabilities: []
});

export const createAppState = () => ({
  user: null,
  isAuthenticated: false,
  data: createFinancialData(),
  loading: false,
  error: null
});

export const createChartData = (name, value, color) => ({
  name,
  value,
  color
});

export const createTimeSeriesData = (date, value) => ({
  date,
  value
});