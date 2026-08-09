import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Skeleton from '../components/Skeleton';
import { motion } from 'framer-motion';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error('Error fetching projects:', err))
            .finally(() => setLoading(false));
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div>
            <Navbar />

            {/* 1. HERO SECTION */}
            <section className="hero">
                {/* HERO SLIDESHOW BACKGROUND */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(/images/hero_software.png) center/cover', opacity: 0, animation: 'fadeBg 12s infinite 0s' }}></div>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(/images/hero_mobile.png) center/cover', opacity: 0, animation: 'fadeBg 12s infinite 4s' }}></div>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(/images/hero_graphics.png) center/cover', opacity: 0, animation: 'fadeBg 12s infinite 8s' }}></div>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.70)' }}></div>
                </div>

                <motion.div
                    className="container hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <h1 style={{ color: 'var(--text-primary)' }}>Elevating Brands Through <span className="highlight">Visual Excellence & Code</span></h1>
                    <div className="text-frame" style={{ margin: '0 auto 40px', maxWidth: '700px' }}>
                        <p style={{ margin: 0 }}>We are a premium agency specializing in Software Development, Mobile Apps, and Graphic Design. We craft unforgettable digital experiences and scalable software solutions.</p>
                    </div>
                    <div className="hero-buttons">
                        <Link to="/signup" className="btn-primary">Start Your Project</Link>
                        <a href="#portfolio" className="btn-secondary">View Our Work</a>
                    </div>
                </motion.div>

                {/* Expertise Widgets Row */}
                <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', marginTop: '60px', zIndex: 10 }}>
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', minWidth: '250px', backdropFilter: 'blur(10px)', textAlign: 'left' }}
                    >
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}><i className="fas fa-code"></i> Software Development</h4>
                        <ul style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0, listStyleType: 'circle', lineHeight: 1.8 }}>
                            <li>Website development</li>
                            <li>Blogs</li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                        style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', minWidth: '250px', backdropFilter: 'blur(10px)', textAlign: 'left' }}
                    >
                        <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}><i className="fas fa-mobile-alt"></i> Mobile App Development</h4>
                        <ul style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0, listStyleType: 'circle', lineHeight: 1.8 }}>
                            <li>Native apps</li>
                            <li>Cross platform apps</li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 }}
                        style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', minWidth: '250px', backdropFilter: 'blur(10px)', textAlign: 'left' }}
                    >
                        <h4 style={{ color: 'var(--accent-tertiary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}><i className="fas fa-paint-brush"></i> Graphics Design</h4>
                        <ul style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0, listStyleType: 'circle', lineHeight: 1.8 }}>
                            <li>Business cards</li>
                            <li>Birthday fliers</li>
                            <li>Branding</li>
                            <li>Logos</li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* CLIENT LOGOS SECTION */}
            <section style={{ padding: '40px 0', borderBottom: '1px solid var(--card-bg)', background: 'var(--bg-color)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>Trusted by innovative companies</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.6, filter: 'grayscale(100%)' }}>
                        <h3 style={{ margin: 0, fontFamily: 'sans-serif' }}>Acme Corp</h3>
                        <h3 style={{ margin: 0, fontFamily: 'serif' }}>Globex</h3>
                        <h3 style={{ margin: 0, fontFamily: 'monospace' }}>Soylent</h3>
                        <h3 style={{ margin: 0, fontFamily: 'sans-serif', fontWeight: 300 }}>Initech</h3>
                    </div>
                </div>
            </section>

            {/* 2. SERVICES SECTION */}
            <section id="services" className="section">
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2 className="section-title">Our Expertise</h2>
                    </motion.div>
                    <div className="services-grid">
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <i className="fas fa-pen-nib card-icon moving-icon"></i>
                            <h3>Brand Identity</h3>
                            <p>Logos, typography, and comprehensive brand guidelines that make your business instantly recognizable.</p>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
                            <i className="fas fa-laptop-code card-icon moving-icon delay-1"></i>
                            <h3>Digital Design</h3>
                            <p>High-converting UI/UX for websites, mobile apps, and engaging digital marketing campaigns.</p>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
                            <i className="fas fa-box-open card-icon moving-icon delay-2"></i>
                            <h3>Print & Packaging</h3>
                            <p>Tactile, premium physical designs for product packaging, brochures, and marketing collateral.</p>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.3 }}>
                            <i className="fas fa-code card-icon moving-icon"></i>
                            <h3>Software Development</h3>
                            <p>Specializing in robust Website development and engaging Blogs to elevate your online presence.</p>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.4 }}>
                            <i className="fas fa-mobile-alt card-icon moving-icon delay-1"></i>
                            <h3>Mobile App Development</h3>
                            <p>Building high-performance Native apps and scalable Cross platform apps for all devices.</p>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.5 }}>
                            <i className="fas fa-paint-brush card-icon moving-icon delay-2"></i>
                            <h3>Graphics Design</h3>
                            <p>Creating stunning Business cards, Birthday fliers, Branding, and memorable Logos.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US & STATS */}
            <section style={{ backgroundColor: 'var(--bg-color)', padding: '100px 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Design that Drives <span className="highlight">Results</span></h2>
                        <div className="text-frame">
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                At Davies Visual Media, we don't just make things look pretty. We build strategic software and stunning designs tailored to your business goals.
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Whether it's a full-stack web application, a native mobile app, or a complete brand overhaul, our expert team delivers excellence at every step.
                            </p>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '15px' }}><i className="fas fa-check-circle" style={{ color: 'var(--accent-primary)', marginRight: '10px' }}></i> Strategic Approach to Design</li>
                            <li style={{ marginBottom: '15px' }}><i className="fas fa-check-circle" style={{ color: 'var(--accent-primary)', marginRight: '10px' }}></i> Transparent Collaboration Process</li>
                            <li style={{ marginBottom: '15px' }}><i className="fas fa-check-circle" style={{ color: 'var(--accent-primary)', marginRight: '10px' }}></i> Dedicated Client Portal</li>
                        </ul>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <motion.div className="card" style={{ textAlign: 'center', padding: '40px 20px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent-primary)', marginBottom: '10px' }}>150+</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Projects Completed</p>
                        </motion.div>
                        <motion.div className="card" style={{ textAlign: 'center', padding: '40px 20px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent-secondary)', marginBottom: '10px' }}>98%</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Client Satisfaction</p>
                        </motion.div>
                        <motion.div className="card" style={{ textAlign: 'center', padding: '40px 20px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent-tertiary)', marginBottom: '10px' }}>5</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Years Experience</p>
                        </motion.div>
                        <motion.div className="card" style={{ textAlign: 'center', padding: '40px 20px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.3 }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent-tertiary)', marginBottom: '10px' }}>12</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Design Awards</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. PORTFOLIO SECTION */}
            <section id="portfolio" className="section">
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2 className="section-title">Selected Works</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '-40px auto 50px' }}>
                            A curated selection of our recent projects. <br />Want to see how we can do this for you? <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Let's talk.</Link>
                        </p>
                    </motion.div>

                    <div className="services-grid">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', border: 'none' }}>
                                    <Skeleton height="250px" borderRadius="0" />
                                    <div style={{ padding: '25px' }}>
                                        <Skeleton height="15px" width="40%" style={{ marginBottom: '10px' }} />
                                        <Skeleton height="25px" width="80%" style={{ marginBottom: '15px' }} />
                                        <Skeleton height="15px" width="100%" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            projects.slice(0, 6).map((proj, i) => (
                                <motion.div
                                    key={proj.id}
                                    className="card"
                                    style={{ padding: 0, overflow: 'hidden', border: 'none' }}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <img src={proj.image_path} alt={proj.title} style={{ width: '100%', height: '250px', objectFit: 'contain', backgroundColor: '#f1f5f9' }} />
                                    <div style={{ padding: '25px' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{proj.category}</span>
                                        <h3 style={{ marginTop: '8px' }}>{proj.title}</h3>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Link to="/signup" className="btn-primary">View Full Portfolio & Get a Quote</Link>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ backgroundColor: 'var(--bg-color)', padding: '100px 0' }}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2 className="section-title">Client Feedback</h2>
                    </motion.div>
                    <div className="services-grid">
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div style={{ color: '#fbbf24', marginBottom: '15px', fontSize: '1.2rem' }}>
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>"Davies Visual Media completely transformed our brand. Their attention to detail and strategic approach delivered a beautiful identity that perfectly matches our vision."</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Kacooni William</h4>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CEO, Wilkac Energies</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
                            <div style={{ color: '#fbbf24', marginBottom: '15px', fontSize: '1.2rem' }}>
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>"The client portal makes working with an agency so easy. We approved designs, requested revisions, and downloaded finals all in one place. Highly recommended!"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Muhwezi Emmanuel.</h4>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>President, SC Ensayi.</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className="card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
                            <div style={{ color: '#fbbf24', marginBottom: '15px', fontSize: '1.2rem' }}>
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>"The UI/UX design they delivered for our e-commerce platform increased our conversion rate by 25% in the first month. Absolutely brilliant work."</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-tertiary)' }}></div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Nuwagira Evan.</h4>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Director, Nuwa Surveying Ltd.</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
