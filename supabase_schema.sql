-- Run this in your Supabase SQL Editor

-- Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    client_id INT REFERENCES public.users(id) ON DELETE SET NULL,
    client_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: We are using Supabase as a Postgres database to mirror your exact previous schema.
-- This ensures all your current features stay exactly the same.
