# Davies Visual Media 🎨

A full-stack web platform for a premium graphic design agency in Mbarara, Uganda. Streamlines client collaboration, project management, and portfolio showcasing.

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Key Features

**Client Portal**
- Secure login with JWT authentication
- Real-time project tracking and updates
- One-click approval or revision requests with feedback
- Premium glassmorphic design and seamless user experience

**Admin Dashboard**
- Upload and manage design projects with image storage
- Track client approvals and revision requests
- Dynamic portfolio management
- Custom layout unified with the public frontend

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, React Hot Toast, Framer Motion, Vanilla CSS  
**Backend:** Node.js, Express.js, Multer  
**Database:** Supabase (PostgreSQL)  
**Storage:** Cloudinary (for portfolio images)  
**Security:** Bcrypt password hashing, JWT for session management, CORS protection  

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase Account
- Cloudinary Account

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/Akamumpa0/Davies-Visual-Media.git
   cd Davies-Visual-Media
   
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Set Up Supabase**
   - Execute the SQL in `supabase_schema.sql` in your Supabase SQL Editor to create the `users` and `projects` tables.

3. **Configure Environment**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   ```

4. **Run Development Servers**
   Open two terminal windows:
   
   Terminal 1 (Backend):
   ```bash
   cd server
   node server.js
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```
   Visit the URL provided by Vite (usually `http://localhost:5173`).

## 📁 Project Structure

```
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/         # Route pages (Home, Admin, Customer, etc.)
│   │   ├── index.css      # Global styles and design tokens
│   │   └── main.jsx       # React entry point
├── server/                # Express backend application
│   ├── server.js          # Main server and API routes
│   └── authMiddleware.js  # JWT authentication middleware
└── supabase_schema.sql    # Database schema setup
```

## 🔐 Security

- Bcrypt password hashing
- JWT-based protected routes
- Cloudinary secure uploads
- Role-based access control (Admin vs Customer)

## 📞 Contact

**Davies Visual Media**  
📍 Mbarara, Uganda  
📧 akamumpadavis21@gmail.com  
📱 +256 774 793 804 | +256 709 470 229

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Davies Visual Media**
