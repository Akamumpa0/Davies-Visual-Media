import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const userJson = localStorage.getItem('daviesUser');
    const user = userJson ? JSON.parse(userJson) : null;
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('daviesUser');
        localStorage.removeItem('daviesToken');
        navigate('/');
    };

    return (
        <header className={`header ${isScrolled ? 'sticky-header' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo-wrapper">
                    <img src="/images/logo.png" alt="Davies Visual Media Logo" className="nav-logo" style={{ maxHeight: '45px' }} />
                    <span className="logo-text">Davies Visual Media</span>
                </Link>

                {/* Hamburger Icon for Mobile */}
                <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ color: 'white' }}>
                    <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                </button>

                <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><a href="/#services" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold' }}>Services</a></li>
                        <li><a href="/#portfolio" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold' }}>Portfolio</a></li>
                        {user ? (
                            <>
                                <li><Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="btn-secondary" onClick={() => setMenuOpen(false)} style={{ background: '#FFD700', color: 'var(--accent-primary)', borderColor: '#FFD700', fontWeight: 'bold' }}>Dashboard</Link></li>
                                <li><button onClick={handleLogout} className="btn-primary" style={{ border: '2px solid #FFD700', fontWeight: 'bold', background: 'transparent', color: 'white', cursor: 'pointer' }}>Log Out</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="btn-secondary" onClick={() => setMenuOpen(false)} style={{ background: '#FFD700', color: 'var(--accent-primary)', borderColor: '#FFD700', fontWeight: 'bold' }}>Client Login</Link></li>
                                <li><Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ border: '2px solid #FFD700', fontWeight: 'bold' }}>Start a Project</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
