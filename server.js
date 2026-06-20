require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// 2. FILE UPLOAD CONFIGURATION
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// ==========================================
// 3. API ROUTES
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
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
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

// ==========================================
// 4. START THE SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Davies Visual Media Server is running on http://localhost:${PORT}`);
});