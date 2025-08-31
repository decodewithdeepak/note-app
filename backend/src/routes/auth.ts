import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Email transporter setup
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Generate JWT token
const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email: string, otp: string) => {
    // In development mode, just log the OTP instead of sending email
    if (process.env.NODE_ENV === 'development') {
        console.log(`📧 [DEV MODE] OTP for ${email}: ${otp}`);
        console.log('🔥 [DEV MODE] Use this OTP to verify your account');
        return;
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Note App Verification',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

// Register with email
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 }),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Create user
        const user = new User({
            email,
            password,
            name,
            authProvider: 'email',
        });

        await user.save();

        // Generate and send OTP
        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        await sendOTPEmail(email, otp);

        res.status(201).json({
            message: 'User registered successfully. Please verify your email with the OTP sent.',
            userId: user._id.toString(),
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify OTP
router.post('/verify-otp', [
    body('userId').notEmpty(),
    body('otp').isLength({ min: 6, max: 6 }),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.otpCode || !user.otpExpires) {
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (user.otpCode !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Verify user
        user.isEmailVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate token
        const token = generateToken(user._id.toString());

        res.json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider,
            },
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Resend OTP
router.post('/resend-otp', [
    body('userId').notEmpty(),
], async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ error: 'Email is already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOTPEmail(user.email, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login with email
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.authProvider !== 'email') {
            return res.status(400).json({
                error: `Please login with ${user.authProvider}`
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isEmailVerified) {
            // Send OTP for verification
            const otp = generateOTP();
            user.otpCode = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            await sendOTPEmail(user.email, otp);

            return res.status(403).json({
                error: 'Email not verified',
                message: 'Please verify your email with the OTP sent.',
                userId: user._id.toString(),
                requiresVerification: true,
            });
        }

        const token = generateToken(user._id.toString());

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed` }),
    (req: Request, res: Response) => {
        const user = req.user as any;
        const token = generateToken(user._id.toString());

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        res.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update profile
router.put('/profile', authenticate, [
    body('name').optional().trim().isLength({ min: 2 }),
], async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const user = req.user!;
        const { name } = req.body;

        if (name) user.name = name;
        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout (for Google OAuth session)
router.post('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

export default router;
