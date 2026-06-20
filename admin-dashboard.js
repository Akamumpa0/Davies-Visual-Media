// ==========================================
// ADMIN DASHBOARD: Load Client Feedback
// ==========================================
const adminProjectsList = document.getElementById('adminProjectsList');

async function loadAdminProjects() {
    if (!adminProjectsList) return;

    try {
        const response = await fetch('http://localhost:3000/api/admin/projects');
        const projects = await response.json();

        if (projects.length === 0) {
            adminProjectsList.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No projects yet. Upload your first design work!</p>';
            return;
        }

        adminProjectsList.innerHTML = '';

        projects.forEach(project => {
            // Status badge styling
            let statusBadge = '';
            let statusColor = '';
            
            if (project.status === 'pending') {
                statusBadge = '⏳ Pending Review';
                statusColor = '#fbbf24';
            } else if (project.status === 'approved') {
                statusBadge = '✅ Approved by Client';
                statusColor = '#22c55e';
            } else if (project.status === 'revision_requested') {
                statusBadge = '🔄 Revision Requested';
                statusColor = '#ef4444';
            }

            // Feedback box (only show if client requested revision)
            let feedbackBox = '';
            if (project.client_feedback) {
                feedbackBox = `
                    <div style="margin-top: 15px; padding: 15px; background: #0a0a0a; border-left: 3px solid var(--accent-secondary); border-radius: 6px;">
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 5px;"><strong>Client Feedback:</strong></p>
                        <p style="color: white; font-style: italic;">"${project.client_feedback}"</p>
                    </div>
                `;
            }

            const projectHTML = `
                <div class="project-item" style="flex-direction: column; align-items: flex-start;">
                    <div style="display: flex; align-items: center; width: 100%; gap: 20px;">
                        <img src="http://localhost:3000${project.image_path}" alt="${project.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #333;">
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 5px;"><i class="fas fa-palette" style="color: var(--accent-primary); margin-right: 8px;"></i> ${project.title}</h4>
                            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px;">${project.category} • <span style="color: ${statusColor};">${statusBadge}</span></p>
                            ${project.client_name ? `<p style="font-size: 0.85rem; color: var(--text-secondary);">Client: ${project.client_name} (${project.client_email})</p>` : ''}
                        </div>
                    </div>
                    ${feedbackBox}
                </div>
            `;
            adminProjectsList.innerHTML += projectHTML;
        });

    } catch (error) {
        adminProjectsList.innerHTML = '<p style="color: var(--error); padding: 20px; text-align: center;">Failed to load projects. Please ensure the server is running.</p>';
        console.error('Error loading admin projects:', error);
    }
}

// Load admin projects when page loads
if (window.location.pathname.includes('admin.html')) {
    loadAdminProjects();
    
    // Refresh every 30 seconds to catch new client actions
    setInterval(loadAdminProjects, 30000);
}