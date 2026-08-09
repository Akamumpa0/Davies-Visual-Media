require('dotenv').config();
const { Client } = require('pg');

console.log('🔄 Connecting to Neon PostgreSQL database...');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect(err => {
    if (err) {
        console.error('❌ Connection failed:', err.stack);
        process.exit(1);
    }
    console.log('✅ Connected to Neon PostgreSQL database!');

    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        client_id INT REFERENCES users(id) ON DELETE SET NULL,
        client_feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    client.query(createUsersTable)
        .then(() => {
            console.log('✅ Users table is ready.');
            return client.query(createProjectsTable);
        })
        .then(() => {
            console.log('✅ Projects table is ready.');
            console.log('🎉 Database setup completed successfully!');
            client.end();
        })
        .catch(err => {
            console.error('❌ Error executing schema setup:', err.stack);
            client.end();
        });
});
