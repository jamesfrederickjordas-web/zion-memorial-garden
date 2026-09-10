const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from the root
app.use(express.static(__dirname));
app.use(express.static(process.cwd()));

// ====================== DATABASE (SUPABASE) ======================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ====================== EMAIL SETUP ======================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ====================== REGISTER ======================
app.post('/register', async (req, res) => {
    try {
        const { fullName, username, email, phone, password } = req.body;

        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const usernameCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (usernameCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const result = await pool.query(
            `INSERT INTO users (full_name, username, email, phone, password_hash, is_verified, verification_token)
             VALUES ($1, $2, $3, $4, $5, false, $6)
             RETURNING id, full_name, username, email, phone, created_at`,
            [fullName, username, email, phone, hashedPassword, verificationToken]
        );

        const user = result.rows[0];

        const baseUrl = process.env.BASE_URL || 'https://zion-memorial-garden.vercel.app';
        const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: `"Zion Memorial Garden" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your Zion Memorial Garden Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Welcome to Zion Memorial Garden!</h2>
                    <p>Hi <strong>${fullName}</strong>,</p>
                    <p>Thank you for registering. Please click the button below to verify your email address:</p>
                    <br>
                    <a href="${verificationLink}" 
                       style="background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Verify My Account
                    </a>
                    <br><br>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #3498db; word-break: break-all;">${verificationLink}</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log("Email error:", emailError);
            return res.status(500).json({ error: 'Account created but failed to send verification email.' });
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account before logging in.'
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// ====================== VERIFY EMAIL ======================
app.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send('<h2>Invalid verification link</h2>');
        }

        const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);

        if (result.rows.length === 0) {
            return res.status(400).send(`
                <h2 style="color: red;">Invalid or expired verification link</h2>
                <p><a href="/">Go back to website</a></p>
            `);
        }

        const user = result.rows[0];

        await pool.query(
            'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1',
            [user.id]
        );

        res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                <h1 style="color: #27ae60;">✓ Email Verified Successfully!</h1>
                <p>Hi <strong>${user.full_name}</strong>, your account has been verified.</p>
                <p>You can now log in to Zion Memorial Garden.</p>
                <br>
                <a href="/" style="background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                    Go to Login
                </a>
            </div>
        `);

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('<h2>Server error during verification</h2>');
    }
});

// ====================== LOGIN ======================
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ 
                error: 'Please verify your email first. Check your Gmail inbox (and Spam folder) for the verification link.' 
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                profile_picture: user.profile_picture || '',
                is_verified: user.is_verified,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// ====================== UPDATE PROFILE ======================
app.put('/update-profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { fullName, username, phone, profilePicture } = req.body;

        const result = await pool.query(
            `UPDATE users 
             SET full_name = $1, username = $2, phone = $3, profile_picture = $4, updated_at = NOW()
             WHERE id = $5
             RETURNING id, full_name, username, email, phone, profile_picture, is_verified, created_at, updated_at`,
            [fullName, username, phone, profilePicture || null, decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error during profile update' });
    }
});

// ====================== GET PROFILE ======================
app.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await pool.query(
            'SELECT id, full_name, username, email, phone, profile_picture, is_verified, created_at, updated_at FROM users WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ====================== TEST ROUTE ======================
app.get('/test', (req, res) => {
    res.send('Server is working! ✅');
});

// ====================== ROOT ROUTE ======================
app.get('/', (req, res) => {
    const indexPath1 = path.join(__dirname, 'index.html');
    const indexPath2 = path.join(process.cwd(), 'index.html');

    if (fs.existsSync(indexPath1)) {
        return res.sendFile(indexPath1);
    }
    if (fs.existsSync(indexPath2)) {
        return res.sendFile(indexPath2);
    }

    res.status(404).send('index.html not found on server');
});

// ====================== START SERVER ======================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
