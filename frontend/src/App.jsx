// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { startActivityTracking } from './services/api';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './login';
import Dashboard from './dashboard';
import Profile from './profile';
import AdminDashboard from './admin_dashboard';
import AllReports from './all_reports';
import Employees from './employee';
import ActivityLogs from './activity_log';
import Settings from './settings';

function App() {
  const { loading, isAuthenticated } = useAuth();

  // Start activity tracking when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = startActivityTracking();
      return cleanup;
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Nunito, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #5ba1fc',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#636e72', fontWeight: '700' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Employee Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/reports" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AllReports />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/employees" 
        element={
          <ProtectedRoute adminOnly={true}>
            <Employees />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/activity-logs" 
        element={
          <ProtectedRoute adminOnly={true}>
            <ActivityLogs />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute adminOnly={true}>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;