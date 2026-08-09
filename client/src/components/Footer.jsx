import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer" style={{ backgroundColor: 'var(--accent-primary)', padding: '60px 0 20px', color: 'white', border: 'none', marginTop: 0 }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: 'white' }}>Davies Visual Media</h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>Elevating brands through visual excellence and scalable software solutions. Your premium partner in digital innovation.</p>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'white' }}>
                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}><i className="fas fa-map-marker-alt" style={{ width: '25px', color: 'white' }}></i> Mbarara, Uganda</li>
                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}><i className="fas fa-phone-alt" style={{ width: '25px', color: 'white' }}></i> 
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <a href="tel:0774793804" style={{ color: 'white' }}>0774 793 804</a>
                                <a href="tel:0709470229" style={{ color: 'white' }}>0709 470 229</a>
                            </div>
                        </li>
                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}><i className="fas fa-envelope" style={{ width: '25px', color: 'white' }}></i> <a href="mailto:akamumpadavis21@gmail.com" style={{ color: 'white' }}>akamumpadavis21@gmail.com</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginRight: '10px', color: 'rgba(255,255,255,0.7)' }}></i> <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginRight: '10px', color: 'rgba(255,255,255,0.7)' }}></i> <a href="#services" style={{ color: 'white', textDecoration: 'none' }}>Services</a></li>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginRight: '10px', color: 'rgba(255,255,255,0.7)' }}></i> <a href="#portfolio" style={{ color: 'white', textDecoration: 'none' }}>Portfolio</a></li>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginRight: '10px', color: 'rgba(255,255,255,0.7)' }}></i> <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Client Login</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px' }}>Follow Us</h4>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><i className="fab fa-instagram"></i></a>
                        <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><i className="fab fa-behance"></i></a>
                        <a href="https://wa.me/256774793804" style={{ color: 'white', fontSize: '1.2rem' }}><i className="fab fa-whatsapp"></i></a>
                    </div>
                </div>
            </div>
            <div className="container" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>&copy; {new Date().getFullYear()} Davies Visual Media. All rights reserved.</p>
            </div>
        </footer>
    );
}
