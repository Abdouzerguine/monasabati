import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VenueProvider } from './contexts/VenueContext';
import './i18n';
import Header from './components/Header';
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
        <Routes>
        </Routes>
      </div>
    );
  }
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