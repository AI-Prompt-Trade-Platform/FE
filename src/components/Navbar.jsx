// src/components/Navbar.jsx
import React from 'react';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">TradeAI</div>
            <input type="text" className="search-bar" placeholder="프론프트 검색" />
            <div className="nav-items">
                <a href="#" className="nav-item">Home</a>
                <a href="#" className="nav-item">Profile</a>
                <a href="#" className="nav-item">Dashboard</a>
                <a href="#" className="nav-item">Wishlist</a>
                <a href="#" className="nav-item">Login</a>
                <a href="#" className="nav-item">Payment</a>
            </div>
        </nav>
    );
}
