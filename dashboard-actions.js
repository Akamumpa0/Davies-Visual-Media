// currentUser is already available from auth.js, no need to redeclare it

// ==========================================
// 1. ADMIN: Handle File Upload to Backend
// ==========================================
const projectImageInput = document.getElementById('projectImage');
const fileNameDisplay = document.getElementById('fileName');

if (projectImageInput) {
    projectImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileNameDisplay.textContent = `Selected: ${this.files[0].name}`;
        }
    });
}

const uploadWorkForm = document.getElementById('uploadWorkForm');
if (uploadWorkForm) {
    uploadWorkForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = uploadWorkForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';

        const formData = new FormData();
        formData.append('title', document.getElementById('projectTitle').value);
        formData.append('category', document.getElementById('projectCategory').value);
        formData.append('image', document.getElementById('projectImage').files[0]);

        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Success! Project uploaded to the database and is now visible to clients.');
                uploadWorkForm.reset();
                fileNameDisplay.textContent = '';
            } else {
                alert('❌ Error: ' + data.error);
            }
        } catch (error) {
            alert('❌ Could not connect to server. Is node server.js running?');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publish to Portfolio';
        }
    });
}

// ==========================================
// 2. ADMIN: Handle Logo Upload Preview (Frontend Only)
// ==========================================
const logoUploadForm = document.getElementById('logoUploadForm');
if (logoUploadForm) {
    logoUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newLogoInput = document.getElementById('newLogo');
        if (newLogoInput.files && newLogoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelectorAll('.nav-logo').forEach(img => {
                    img.src = e.target.result;
                });
                alert('✅ Company logo updated visually!');
            }
            reader.readAsDataURL(newLogoInput.files[0]);
        }
    });
}

// ==========================================
// 3. CUSTOMER: Dynamically Load Projects from Database
// ==========================================
// ==========================================
// 4. CUSTOMER: Handle Approve/Revise Actions via Backend
// ==========================================
async function handleClientAction(action, projectName, projectId) {
    const status = action === 'approve' ? 'approved' : 'revision_requested';
    let client_feedback = null;
    
    if (action === 'revise') {
        client_feedback = prompt(`Please briefly describe the revisions needed for "${projectName}":`);
        if (!client_feedback) return; // User cancelled
    }

    try {
        const response = await fetch(`http://localhost:3000/api/admin/projects/${projectId}/feedback`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: status,
                client_feedback: client_feedback
            })
        });

        if (response.ok) {
            const message = action === 'approve' 
                ? `✅ Approved! The Davies Visual Media team has been notified.` 
                : `📝 Revision request sent! The team will review your notes.`;
            alert(message);
            
            // Reload the projects to show the updated status badge
            loadCustomerProjects();
        } else {
            alert('❌ Failed to update project status.');
        }
    } catch (error) {
        alert('❌ Could not connect to server.');
    }
}

// Run this function as soon as the customer dashboard loads
if (window.location.pathname.includes('customer.html')) {
    loadCustomerProjects();
}

// ==========================================
// 4. CUSTOMER: Handle Approve/Revise Actions via Backend
// ==========================================
async function handleClientAction(action, projectName, projectId) {
    const status = action === 'approve' ? 'approved' : 'revision_requested';
    
    if (action === 'revise') {
        const reason = prompt(`Please briefly describe the revisions needed for "${projectName}":`);
        if (!reason) return; // User cancelled
    }

    try {
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });

        if (response.ok) {
            const message = action === 'approve' 
                ? `✅ Approved! The Davies Visual Media team has been notified.` 
                : `📝 Revision request sent! The team will review your notes.`;
            alert(message);
            
            // Reload the projects to show the updated status badge
            loadCustomerProjects();
        } else {
            alert('❌ Failed to update project status.');
        }
    } catch (error) {
        alert('❌ Could not connect to server.');
    }
}