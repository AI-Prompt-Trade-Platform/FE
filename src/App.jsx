import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'
import DiscoverPage from './pages/DiscoverPage'
import AboutPage from './pages/AboutPage'
import WishlistPage from './pages/WishlistPage'
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
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
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
      <Footer />
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