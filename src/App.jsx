import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'
import './App.css'

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  return (
    <div className="App">
      {!isLandingPage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
