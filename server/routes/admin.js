const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();

// Temporary in-memory storage for verification codes
const pendingVerify = {};
const MAX_ATTEMPTS = 3;

//  Sending admin verification code
router.post('/send-admin-verification', async (req, res) => {
    try {
        // Generate a random 6-character verification code (hex)
        const verificationCode = crypto.randomBytes(3).toString('hex');
        const ownerEmail = process.env.USER;

        pendingVerify[ownerEmail] = { verificationCode, retryCount: 0 };

        // Configure email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: ownerEmail,
                pass: process.env.PASS,
            },
        });

        // Send verification code to owner
        // To open admin dashboard
        await transporter.sendMail({
            from: '"Paris Nails Spa" <no-reply@parisnails.com>',
            to: ownerEmail,
            subject: 'Admin Access Verification Code',
            text: `Your admin access verification code is: ${verificationCode}`,
        });

        res.status(200).send({ message: 'Verification code sent to owner\'s email' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send verification code. Please try again later.' });
    }
});

// verify the admin code
router.post('/verify-admin-code', (req, res) => {
    const { code } = req.body;
    const ownerEmail = process.env.USER;

    // Retrieve pending verification data
    const pendingData = pendingVerify[ownerEmail];

    if (!pendingData) {
        return res.status(404).send({ message: 'No pending verification code found' });
    }

    // Check if the provided code matches the stored code
    if (pendingData.verificationCode !== code) {
        pendingData.retryCount = (pendingData.retryCount || 0) + 1;

        if (pendingData.retryCount >= MAX_ATTEMPTS) {
            delete pendingVerify[ownerEmail];
            return res.status(400).send({ message: 'Invalid verification code. Verification code has been discarded after multiple attempts.' });
        } else {
            return res.status(400).send({ message: `Invalid verification code. You have ${MAX_ATTEMPTS - pendingData.retryCount} attempts left.` });
        }
    }
    delete pendingVerify[ownerEmail];

    res.status(200).send({ message: 'Verification code is valid' });
});

module.exports = router;
