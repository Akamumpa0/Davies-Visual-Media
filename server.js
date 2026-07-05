require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(express.static(path.join(__dirname))); // Serves CSS, JS, and root images

// ==========================================
// 1. DATABASE CONNECTION
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to Davies Media MySQL Database!');
});

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
// 3. SERVE HTML PAGES (For Clean URLs)
// ==========================================
// This allows users to visit /login instead of /login.html
const htmlPages = ['login', 'signup', 'customer', 'admin'];
htmlPages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, `${page}.html`));
    });
});

// ==========================================
// 4. API ROUTES
// ==========================================

// --- SIGNUP ---
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) return res.status(400).json({ error: 'Email already registered' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        res.status(201).json({ message: 'User created successfully', userId: result.insertId, role });
    } catch (error) {
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'Invalid email or password' });
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
        
        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --- UPLOAD PROJECT (Admin) ---
app.post('/api/projects', upload.single('image'), async (req, res) => {
    const { title, category } = req.body;
    // Cloudinary returns the hosted image URL in req.file.path
    const imagePath = req.file ? req.file.path : null; 
    if (!imagePath) return res.status(400).json({ error: 'Image file is required' });

    try {
        const [result] = await db.promise().query(
            'INSERT INTO projects (title, category, image_path) VALUES (?, ?, ?)',
            [title, category, imagePath]
        );
        res.status(201).json({ message: 'Project uploaded successfully', projectId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Server error uploading project' });
    }
});

// --- GET PROJECTS (Public/Customer) ---
app.get('/api/projects', async (req, res) => {
    try {
        const [projects] = await db.promise().query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching projects' });
    }
});

// --- UPDATE PROJECT STATUS (Customer Approve/Revise) ---
app.patch('/api/projects/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.promise().query('UPDATE projects SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Project status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: 'Server error updating status' });
    }
});

// --- ADMIN: Get Projects with Client Feedback ---
app.get('/api/admin/projects', async (req, res) => {
    try {
        const [projects] = await db.promise().query(`
            SELECT p.*, u.name as client_name, u.email as client_email 
            FROM projects p 
            LEFT JOIN users u ON p.client_id = u.id 
            ORDER BY p.created_at DESC
        `);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching admin projects' });
    }
});

// --- ADMIN: Update Project with Feedback ---
app.patch('/api/admin/projects/:id/feedback', async (req, res) => {
    const { id } = req.params;
    const { status, client_feedback } = req.body;
    try {
        await db.promise().query(
            'UPDATE projects SET status = ?, client_feedback = ? WHERE id = ?',
            [status, client_feedback, id]
        );
        res.json({ message: 'Project feedback updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error updating feedback' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Davies Visual Media Server is running on port ${PORT}`);
});