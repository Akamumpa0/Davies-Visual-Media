import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('daviesUser') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('daviesUser');
    localStorage.removeItem('daviesToken');
    navigate('/');
  };

  const handleClientAction = async (action, projectName, projectId) => {
    const status = action === 'approve' ? 'approved' : 'revision_requested';
    let client_feedback = null;
    
    if (action === 'revise') {
      client_feedback = window.prompt(`Please briefly describe the revisions needed for "${projectName}":`);
      if (!client_feedback) return; // User cancelled
    }

    try {
      const token = localStorage.getItem('daviesToken');
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            status: status,
            client_feedback: client_feedback
        })
      });

      if (response.ok) {
        const message = action === 'approve' 
          ? `Approved! The Davies Visual Media team has been notified.` 
          : `Revision request sent! The team will review your notes.`;
        toast.success(message);
        fetchProjects(); // Reload projects
      } else {
        toast.error('Failed to update project status.');
      }
    } catch (error) {
      toast.error('Could not connect to server.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="status-badge status-approved"><i className="fas fa-check-circle"></i> Approved</span>;
      case 'revision_requested': return <span className="status-badge status-revision"><i className="fas fa-exclamation-circle"></i> Revision Requested</span>;
      default: return <span className="status-badge status-pending"><i className="fas fa-clock"></i> Pending Review</span>;
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '120px', flex: 1, paddingBottom: '60px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(59, 130, 246, 0.05))', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div className="dashboard-grid">
          <aside className="sidebar">
            <ul>
              <li><a href="#my-projects" className="active"><i className="fas fa-folder-open" style={{ width: '20px' }}></i> My Projects</a></li>
              <li><a href="#our-services"><i className="fas fa-palette" style={{ width: '20px' }}></i> Our Services</a></li>
              <li><a href="#about-us"><i className="fas fa-info-circle" style={{ width: '20px' }}></i> About Us</a></li>
              <li><a href="#contact-us"><i className="fas fa-envelope" style={{ width: '20px' }}></i> Contact Us</a></li>
            </ul>
          </aside>

          <main className="main-content">
            <h2 style={{ marginBottom: '10px' }}>Welcome, <span className="highlight">{user.name || 'Valued Client'}</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Your dedicated portal for project management and creative collaboration.</p>
            
            <section id="my-projects" className="portal-section">
              <h3>My Active Projects</h3>
              <p>Review and approve your recent design deliverables.</p>
              
              <div>
                {loading ? (
                  <Spinner size="50px" />
                ) : projects.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', padding: '20px', textAlign: 'center' }}>No projects available for review.</p>
                ) : (
                  projects.map(project => (
                    <div className="project-card" key={project.id}>
                      <img src={project.image_path} alt={project.title} className="project-image" />
                      <div className="project-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{project.category}</span>
                            <h4 style={{ marginTop: '5px', fontSize: '1.2rem' }}>{project.title}</h4>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        
                        <div className="action-btns">
                          <button className="btn-revise" onClick={() => handleClientAction('revise', project.title, project.id)}>
                            <i className="fas fa-undo"></i> Request Revision
                          </button>
                          <button className="btn-approve" onClick={() => handleClientAction('approve', project.title, project.id)}>
                            <i className="fas fa-check"></i> Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section id="our-services" className="portal-section">
              <h3>Our Expertise</h3>
              <p>Comprehensive design and development solutions tailored to elevate your brand.</p>
              <div className="services-grid">
                <div className="card">
                  <i className="fas fa-code card-icon moving-icon"></i>
                  <h3>Software Development</h3>
                  <p>Specializing in robust Website development and engaging Blogs to elevate your online presence.</p>
                </div>
                <div className="card">
                  <i className="fas fa-mobile-alt card-icon moving-icon delay-1"></i>
                  <h3>Mobile App Development</h3>
                  <p>Building high-performance Native apps and scalable Cross platform apps for all devices.</p>
                </div>
                <div className="card">
                  <i className="fas fa-paint-brush card-icon moving-icon delay-2"></i>
                  <h3>Graphics Design</h3>
                  <p>Creating stunning Business cards, Birthday fliers, Branding, and memorable Logos.</p>
                </div>
              </div>
            </section>

            <section id="about-us" className="portal-section">
              <h3>About Davies Visual Media</h3>
              <p>
                Welcome to Davies Visual Media. Based in the heart of Mbarara, Uganda, we are a passionate team of creative professionals dedicated to elevating brands through visual excellence and technical innovation. 
                <br/><br/>
                We specialize in Software Development, Mobile App Development, and Graphics Design. Whether you need a native mobile application, a scalable business website, or stunning branding collateral like logos and business cards, we blend artistry with technical strategy to help your business stand out and succeed in a competitive world.
              </p>
            </section>

            <section id="contact-us" className="portal-section">
              <h3>Get In Touch</h3>
              <p>Have a question, need to discuss a project, or just want to say hello? We are here for you.</p>
              
              <div className="contact-grid">
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h4>Call Us</h4>
                    <a href="tel:0774793804">0774 793 804</a><br/>
                    <a href="tel:0709470229">0709 470 229</a>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email Us</h4>
                    <a href="mailto:akamumpadavis21@gmail.com">akamumpadavis21@gmail.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Visit Us</h4>
                    <p>Mbarara, Uganda</p>
                  </div>
                </div>
              </div>

              <h4 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Connect With Us</h4>
              <div className="dashboard-quick-links">
                <a href="https://wa.me/256774793804" target="_blank" rel="noreferrer" className="quick-link" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="quick-link" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="quick-link" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://behance.net" target="_blank" rel="noreferrer" className="quick-link" title="Behance"><i className="fab fa-behance"></i></a>
              </div>
            </section>
          </main>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
