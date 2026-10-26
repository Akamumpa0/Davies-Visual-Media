const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { EnvHttpProxyAgent, setGlobalDispatcher } = require('undici');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('./authMiddleware');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy) {
    setGlobalDispatcher(new EnvHttpProxyAgent());
}

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(express.static(path.join(__dirname, '../client/dist'))); // Serves static React build files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// 1. DATABASE CONNECTION (SUPABASE)
// ==========================================
// Provide SUPABASE_URL and SUPABASE_ANON_KEY (or service role key) in .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env.');
}
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Initialized Supabase client!');

// ==========================================
// 2. CLOUDINARY FILE UPLOAD CONFIGURATION
// ==========================================
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Multer to use Cloudinary instead of local disk
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'davies_media_projects', // Folder name in your Cloudinary dashboard
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
});
const upload = multer({ storage: storage });

// ==========================================
// 3. API ROUTES
// ==========================================

// --- SIGNUP ---
app.post('/api/signup', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'customer']).withMessage('Invalid role')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { name, email, password, role } = req.body;
    try {
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (checkError) throw checkError;
        if (existingUser.length > 0) return res.status(400).json({ error: 'Email already registered' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, role }])
            .select();
            
        if (insertError) throw insertError;
        
        const user = newUser[0];
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );
        
        res.status(201).json({ 
            message: 'User created successfully', 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// --- LOGIN ---
app.post('/api/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { email, password } = req.body;
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);
            
        if (error) throw error;
        if (users.length === 0) return res.status(400).json({ error: 'Invalid email or password' });
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
        
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );
        
        res.json({ 
            message: 'Login successful', 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --- UPLOAD PROJECT (Admin) ---
app.post('/api/projects', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    const { title, category } = req.body;
    // Cloudinary returns the hosted image URL in req.file.path
    const imagePath = req.file ? req.file.path : null; 
    if (!imagePath) return res.status(400).json({ error: 'Image file is required' });

    try {
        const { data: newProject, error } = await supabase
            .from('projects')
            .insert([{ title, category, image_path: imagePath }])
            .select();
            
        if (error) throw error;
        res.status(201).json({ message: 'Project uploaded successfully', projectId: newProject[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error uploading project' });
    }
});

// --- GET PROJECTS (Public/Customer) ---
app.get('/api/projects', async (req, res) => {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching projects' });
    }
});

// --- UPDATE PROJECT STATUS (Customer Approve/Revise) ---
app.patch('/api/projects/:id/status', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status, client_feedback } = req.body;
    try {
        const updateData = { status };
        if (client_feedback !== undefined) {
            updateData.client_feedback = client_feedback;
        }
        
        const { error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id);
            
        if (error) throw error;
        res.json({ message: `Project status updated to ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating status' });
    }
});

// --- ADMIN: Get Projects with Client Feedback ---
app.get('/api/admin/projects', verifyToken, isAdmin, async (req, res) => {
    try {
        // Supabase join syntax equivalent:
        const { data: projects, error } = await supabase
            .from('projects')
            .select(`
                *,
                client:client_id (
                    name,
                    email
                )
            `)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        // Transform data to match previous response format
        const formattedProjects = projects.map(p => ({
            ...p,
            client_name: p.client ? p.client.name : null,
            client_email: p.client ? p.client.email : null,
            client: undefined
        }));
        
        res.json(formattedProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching admin projects' });
    }
});

// --- ADMIN: Update Project with Feedback ---
app.patch('/api/admin/projects/:id/feedback', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status, client_feedback } = req.body;
    try {
        const { error } = await supabase
            .from('projects')
            .update({ status, client_feedback })
            .eq('id', id);
            
        if (error) throw error;
        res.json({ message: 'Project feedback updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating feedback' });
    }
});

// Catch-all route to serve React's index.html for client-side routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Davies Visual Media Server is running on port ${PORT}`);
});