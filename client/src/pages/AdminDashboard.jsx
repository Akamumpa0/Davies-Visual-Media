import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [image, setImage] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('daviesUser') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('daviesToken');
      const response = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching admin projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('daviesUser');
    localStorage.removeItem('daviesToken');
    navigate('/');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('daviesToken');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Project uploaded to the portfolio.');
        setTitle('');
        setCategory('Software Development');
        setImage(null);
        document.getElementById('projectImage').value = '';
        fetchProjects(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error('Error: ' + data.error);
      }
    } catch (error) {
      toast.error('Could not connect to server.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="status-badge status-approved">Approved</span>;
      case 'revision_requested': return <span className="status-badge status-revision">Revision Requested</span>;
      default: return <span className="status-badge status-pending">Pending Review</span>;
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
              <li><a href="#overview" className="active"><i className="fas fa-chart-pie" style={{ width: '20px' }}></i> Overview</a></li>
              <li><a href="#client-feedback"><i className="fas fa-comments" style={{ width: '20px' }}></i> Client Feedback</a></li>
              <li><a href="#upload-section"><i className="fas fa-cloud-upload-alt" style={{ width: '20px' }}></i> Upload Sample Work</a></li>
              <li><a href="#settings-section"><i className="fas fa-cog" style={{ width: '20px' }}></i> Settings & Logo</a></li>
            </ul>
          </aside>
          
          <main className="main-content">
            <h2 style={{ marginBottom: '10px' }}>Welcome, <span className="highlight">{user.name || 'Administrator'}</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Manage client projects, review feedback, and upload sample work to the public portfolio.</p>
            
            <section id="client-feedback" className="portal-section">
              <h3 style={{ marginBottom: '20px' }}>Client Project Status & Feedback</h3>
              <p style={{ marginBottom: '30px' }}>Track what clients are saying about their projects.</p>
              
              <div>
                {loading ? (
                  <Spinner size="50px" />
                ) : projects.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', padding: '20px', textAlign: 'center' }}>No projects found in the database.</p>
                ) : (
                  projects.map(project => (
                    <div className="project-card admin-project-card" key={project.id}>
                      <div className="admin-project-header">
                        <div>
                          <h4>{project.title}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Client: {project.client_name || 'Unassigned'} ({project.client_email || 'N/A'})
                          </span>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                        <img src={project.image_path} alt={project.title} style={{ width: '150px', height: '100px', objectFit: 'contain', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                        
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: '0.9rem', marginBottom: '5px', color: 'var(--text-secondary)' }}>Client Feedback Notes:</h5>
                          {project.client_feedback ? (
                            <div className="feedback-box">
                              <i className="fas fa-quote-left" style={{ color: 'var(--accent-primary)', marginRight: '10px' }}></i>
                              {project.client_feedback}
                            </div>
                          ) : (
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>No feedback provided yet.</p>
                          )}
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                            Uploaded on: {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section id="upload-section" style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--card-bg)' }}>
              <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Upload Sample Work / Portfolio Project</h3>
              <form onSubmit={handleUploadSubmit}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Nova Tech Rebrand" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Software Development">Software Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Graphics Design">Graphics Design</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Project Image</label>
                  <div className="upload-zone" onClick={() => document.getElementById('projectImage').click()}>
                    <i className="fas fa-cloud-upload-alt moving-icon"></i>
                    <p>Click to upload or drag and drop</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PNG, JPG up to 5MB</p>
                    <input type="file" id="projectImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => setImage(e.target.files[0])} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{image ? `Selected: ${image.name}` : ''}</p>
                </div>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Publish to Portfolio'}
                </button>
              </form>
            </section>

            <section id="settings-section">
              <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Update Company Logo</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                toast.success('Logo updated locally! (Requires backend implementation to save persistently)');
              }}>
                <div className="form-group">
                  <label>New Logo File</label>
                  <input type="file" accept="image/*" className="form-control" />
                </div>
                <button type="submit" className="btn-secondary">Update Site Logo</button>
              </form>
            </section>
          </main>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
