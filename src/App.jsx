import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import HostDashboard from './pages/Host/HostDashboard';
import TouristDashboard from './pages/Tourist/TouristDashboard';
import GuideDashboard from './pages/Guide/GuideDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#b71c1c',
    },
    success: {
      main: '#48bb78',
    },
    warning: {
      main: '#ed8936',
    },
    error: {
      main: '#f56565',
    },
    info: {
      main: '#4299e1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={
                  user?.role === 'admin' ? '/admin/dashboard' :
                  user?.role === 'host' ? '/host/dashboard' :
                  user?.role === 'tourist' ? '/tourist/dashboard' :
                  user?.role === 'guide' ? '/guide/dashboard' : '/'
                } replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to={
                  user?.role === 'admin' ? '/admin/dashboard' :
                  user?.role === 'host' ? '/host/dashboard' :
                  user?.role === 'tourist' ? '/tourist/dashboard' :
                  user?.role === 'guide' ? '/guide/dashboard' : '/'
                } replace />
              ) : (
                <Register />
              )
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Host Routes */}
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute allowedRoles={['host']}>
                <HostDashboard />
              </ProtectedRoute>
            }
          />

          {/* Tourist Routes */}
          <Route
            path="/tourist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['tourist']}>
                <TouristDashboard />
              </ProtectedRoute>
            }
          />

          {/* Guide Routes */}
          <Route
            path="/guide/dashboard"
            element={
              <ProtectedRoute allowedRoles={['guide']}>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
