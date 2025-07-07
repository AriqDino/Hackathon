-- Initialize database for Indonesian Financial Education Chatbot

-- Create the database if it doesn't exist (this will be handled by docker-compose)
-- CREATE DATABASE chatbot_db;

-- Create the user if it doesn't exist (this will be handled by docker-compose)
-- CREATE USER chatbot_user WITH PASSWORD 'chatbot_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE chatbot_db TO chatbot_user;

-- Connect to the database
\c chatbot_db;

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    language TEXT NOT NULL CHECK (language IN ('id', 'en', 'zh')),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);

-- Grant permissions to tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chatbot_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO chatbot_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chatbot_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO chatbot_user;