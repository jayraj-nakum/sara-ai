-- Create database if not exists
CREATE DATABASE IF NOT EXISTS chat_app;
USE chat_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message_type ENUM('user', 'bot') NOT NULL,
    message_text TEXT NOT NULL,
    sara_mood VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert a default user for testing
INSERT INTO users (username, email, password) VALUES 
('Test User', 'test@example.com', 'password123')
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Show table structures
DESCRIBE users;
DESCRIBE messages; 