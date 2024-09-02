const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();

// Endpoint to send admin verification code
router.post('/send-admin-verification', async (req, res) => {
    try {
        // Generate a random verification code
        const verificationCode = crypto.randomBytes(3).toString('hex'); // 6-character code
        const ownerEmail = process.env.USER; // Set your owner's email in the .env file

        // Configure your email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: '"Paris Nails Spa" <no-reply@parisnails.com>',
            to: ownerEmail,
            subject: 'Admin Access Verification Code',
            text: `Your admin access verification code is: ${verificationCode}`,
        });

        // Store the verification code in the session
        if (!req.session.adminVerificationCodes) {
            req.session.adminVerificationCodes = {};
        }
        req.session.adminVerificationCodes[ownerEmail] = verificationCode;

        res.status(200).send({ message: 'Verification code sent to owner\'s email' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send verification code' });
    }
});

// Endpoint to verify the admin code
router.post('/verify-admin-code', (req, res) => {
    const { email, code } = req.body;

    // Check if the provided email has a pending verification code
    if (!req.session.adminVerificationCodes || req.session.adminVerificationCodes[email] !== code) {
        return res.status(400).send({ message: 'Invalid verification code' });
    }

    // Clear the verification code after successful verification
    delete req.session.adminVerificationCodes[email];

    res.status(200).send({ message: 'Verification code is valid' });
});


module.exports = router;
