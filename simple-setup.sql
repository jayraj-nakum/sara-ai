USE chat_app;

-- Check if messages table exists and show its structure
SHOW TABLES;
DESCRIBE messages;

-- If messages table doesn't exist, create it
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 1,
    message_type ENUM('user', 'bot') NOT NULL,
    message_text TEXT NOT NULL,
    sara_mood VARCHAR(50) DEFAULT 'friendly',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Check users table
DESCRIBE users;

-- If users table doesn't exist, create it  
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL DEFAULT 'Test User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user if not exists
INSERT IGNORE INTO users (id, username) VALUES (1, 'Test User');

-- Show final structure
SELECT 'Users table:' as info;
SELECT * FROM users;

SELECT 'Messages table structure:' as info;
DESCRIBE messages; 