import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VenueProvider } from './contexts/VenueContext';
import './i18n';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import VenueDetails from './pages/VenueDetails';
import AddVenue from './pages/AddVenue';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import LanguageSelector from './components/LanguageSelector';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { i18n } = useTranslation();

  // Set document direction for RTL languages
  React.useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          <Header />
          <div className="absolute top-4 right-4">
            <LanguageSelector />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Header />
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>
      </div>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
        <Route path="/venue/:id" element={user ? <VenueDetails /> : <Navigate to="/login" />} />
        <Route path="/add-venue" element={user?.userType === 'owner' ? <AddVenue /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user?.userType === 'owner' ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <VenueProvider>
          <Router>
            <AppContent />
          </Router>
        </VenueProvider>
      </AuthProvider>
    </div>
  );
}

export default App;