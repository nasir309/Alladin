import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createAppState, createFinancialData } from '../types';

const initialState = createAppState();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGOUT':
      localStorage.removeItem('myfintrack_user');
      localStorage.removeItem('myfintrack_data');
      return {
        ...initialState,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'ADD_INCOME':
      const newIncomeData = {
        ...state.data,
        income: [...state.data.income, action.payload],
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(newIncomeData));
      return {
        ...state,
        data: newIncomeData,
      };
    case 'UPDATE_INCOME':
      const updatedIncomeData = {
        ...state.data,
        income: state.data.income.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(updatedIncomeData));
      return {
        ...state,
        data: updatedIncomeData,
      };
    case 'DELETE_INCOME':
      const filteredIncomeData = {
        ...state.data,
        income: state.data.income.filter(item => item.id !== action.payload),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(filteredIncomeData));
      return {
        ...state,
        data: filteredIncomeData,
      };
    case 'ADD_EXPENSE':
      const newExpenseData = {
        ...state.data,
        expenses: [...state.data.expenses, action.payload],
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(newExpenseData));
      return {
        ...state,
        data: newExpenseData,
      };
    case 'UPDATE_EXPENSE':
      const updatedExpenseData = {
        ...state.data,
        expenses: state.data.expenses.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(updatedExpenseData));
      return {
        ...state,
        data: updatedExpenseData,
      };
    case 'DELETE_EXPENSE':
      const filteredExpenseData = {
        ...state.data,
        expenses: state.data.expenses.filter(item => item.id !== action.payload),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(filteredExpenseData));
      return {
        ...state,
        data: filteredExpenseData,
      };
    case 'ADD_ASSET':
      const newAssetData = {
        ...state.data,
        assets: [...state.data.assets, action.payload],
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(newAssetData));
      return {
        ...state,
        data: newAssetData,
      };
    case 'UPDATE_ASSET':
      const updatedAssetData = {
        ...state.data,
        assets: state.data.assets.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(updatedAssetData));
      return {
        ...state,
        data: updatedAssetData,
      };
    case 'DELETE_ASSET':
      const filteredAssetData = {
        ...state.data,
        assets: state.data.assets.filter(item => item.id !== action.payload),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(filteredAssetData));
      return {
        ...state,
        data: filteredAssetData,
      };
    case 'ADD_LIABILITY':
      const newLiabilityData = {
        ...state.data,
        liabilities: [...state.data.liabilities, action.payload],
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(newLiabilityData));
      return {
        ...state,
        data: newLiabilityData,
      };
    case 'UPDATE_LIABILITY':
      const updatedLiabilityData = {
        ...state.data,
        liabilities: state.data.liabilities.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(updatedLiabilityData));
      return {
        ...state,
        data: updatedLiabilityData,
      };
    case 'DELETE_LIABILITY':
      const filteredLiabilityData = {
        ...state.data,
        liabilities: state.data.liabilities.filter(item => item.id !== action.payload),
      };
      localStorage.setItem('myfintrack_data', JSON.stringify(filteredLiabilityData));
      return {
        ...state,
        data: filteredLiabilityData,
      };
    case 'LOAD_DATA':
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('myfintrack_user');
    const savedData = localStorage.getItem('myfintrack_data');
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: data });
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}