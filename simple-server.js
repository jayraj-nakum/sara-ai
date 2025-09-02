const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
    host: 'ballast.proxy.rlwy.net',
    user: 'root',
    password: 'AIzaSyBn2_gAI6bGLzd-7OllnIYtkLd59Ggq4Ow', // Replace with your actual password from Railway
    database: 'railway',
    port: 51706
};

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connected to database');
        }
    });

    db.on('error', err => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

// Endpoint to register a new user
app.post('/register-user', async (req, res) => {
    const { userName } = req.body;

    if (!userName) {
        return res.status(400).json({ error: 'userName is required' });
    }

    try {
        // Check if user exists in users table, if not create entry with unique username
        const checkUserQuery = 'SELECT username FROM users WHERE username LIKE ?';
        db.query(checkUserQuery, [`${userName}%`], (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                let finalUserName = userName;
                
                if (results.length > 0) {
                    // User with similar name exists, create unique username
                    let counter = 1;
                    let found = false;
                    
                    while (!found) {
                        const testName = `${userName}_${counter}`;
                        const exists = results.some(row => row.username === testName);
                        
                        if (!exists) {
                            finalUserName = testName;
                            found = true;
                        } else {
                            counter++;
                        }
                    }
                }
                
                // Create new user
                const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
                db.query(insertUserQuery, [finalUserName, 'default123'], (err, result) => {
                    if (err) {
                        console.error('Error creating new user:', err);
                        res.status(500).json({ error: 'Failed to create user' });
                    } else {
                        console.log(`New user registered: ${finalUserName} with ID: ${result.insertId}`);
                        res.json({ 
                            success: true, 
                            message: 'User registered successfully', 
                            userName: finalUserName,
                            userId: result.insertId
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error in /register-user endpoint:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Simple endpoint to save chat messages (no user creation)
app.post('/save-chat', async (req, res) => {
    const { userName, userMessage, aiResponse, saraMood } = req.body;

    if (!userName || !userMessage || !aiResponse) {
        return res.status(400).json({ error: 'userName, userMessage, and aiResponse are required' });
    }

    try {

        // First, get the user ID from users table
        const getUserIdQuery = 'SELECT id FROM users WHERE username = ? ORDER BY id DESC LIMIT 1';
        db.query(getUserIdQuery, [userName], (err, userResults) => {
            if (err) {
                console.error('Error getting user ID:', err);
                res.status(500).json({ error: 'Failed to find user' });
                return;
            }
            
            if (userResults.length === 0) {
                console.error('User not found in database:', userName);
                res.status(400).json({ error: 'User not registered. Please register first.' });
                return;
            }
            
            const userId = userResults[0].id;
            
            // Save user message (format: "USER (userName): message")
            const userMsgFormatted = `USER (${userName}): ${userMessage}`;
            const insertUserMsgQuery = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
            db.query(insertUserMsgQuery, [userId, userMsgFormatted], (err, result) => {
                if (err) {
                    console.error('Error saving user message:', err);
                    console.error('SQL:', insertUserMsgQuery);
                    console.error('Values:', [userId, userMsgFormatted]);
                } else {
                    console.log(`User message saved with ID: ${result.insertId} - ${userName} (User ID: ${userId})`);
                }
            });

            // Save AI response (format: "SARA (mood): response") 
            const aiMsgFormatted = `SARA (${saraMood || 'friendly'}): ${aiResponse}`;
            const insertAiMsgQuery = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
            db.query(insertAiMsgQuery, [userId, aiMsgFormatted], (err, result) => {
                if (err) {
                    console.error('Error saving AI message:', err);
                    console.error('SQL:', insertAiMsgQuery);
                    console.error('Values:', [userId, aiMsgFormatted]);
                } else {
                    console.log(`AI message saved with ID: ${result.insertId} - Sara (${saraMood || 'friendly'}) (User ID: ${userId})`);
                }
            });
            
            res.json({ success: true, message: 'Chat saved successfully', userName: userName });
        });

    } catch (error) {
        console.error('Error in /save-chat endpoint:', error);
        res.status(500).json({ error: 'Failed to save chat' });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Simple chat saver server running on port ${PORT}`);
}); 