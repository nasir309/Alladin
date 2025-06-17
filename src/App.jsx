import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './Context/AppContext';
import Layout from './Components/Layout/Layout';
import LoginForm from './Components/Auth/LoginForm';
import Dashboard from './Pages/Dashboard';
import Income from './Pages/Income';
import Expenses from './Pages/Expenses';
import Assets from './Pages/Assets';
import Liabilities from './Pages/Liabilities';

function AppContent() {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/liabilities" element={<Liabilities />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;