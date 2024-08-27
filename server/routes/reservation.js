const router = require("express").Router();
const Reservation = require('../models/reservation');
const nodemailer = require('nodemailer');

const pendingVerify = {};

// Add reservation and send verification code
router.post("/", async (req, res) => {
    try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
        const { name, email, date, time } = req.body;

        pendingVerify[email] = { name, email, date, time, verificationCode };

        // const newReservation = new Reservation({ name, email, date: new Date(date), time, verificationCode, verified: false });
        // await newReservation.save();

        // Send verification code via email
        await sendVerificationEmail(email, verificationCode);

        res.status(201).send({ message: "Reservation created successfully, verification code sent to email", reservation: newReservation });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Function to send the verification email with the code
const sendVerificationEmail = async (to, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    await transporter.sendMail({
        from: process.env.USER,
        to,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`
    });
};

// Verify the email with the code
router.post("/verify-email", async (req, res) => {
    const { email, code } = req.body;
    
    const pendingReservation = pendingVerify[email];

    if (!pendingReservation) {
        return res.status(404).send({ message: "No pending reservation found" });
    }

    if (pendingReservation.verificationCode === code) {
        // Save reservation to the database if the code is correct
        const { name, date, time } = pendingReservation;
        const newReservation = new Reservation({ name, email, date: new Date(date), time, verified: true });

        await newReservation.save();

        // Remove the pending reservation from memory after successful verification
        delete pendingVerify[email];

        res.status(200).send({ message: "Email verified and reservation saved successfully" });
    } else {
        // If the code is incorrect, discard the pending reservation
        delete pendingVerify[email];
        res.status(400).send({ message: "Invalid verification code, reservation discarded" });
    }
});


// Show info
router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.find({});
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Delete info
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReservation = await Reservation.findByIdAndDelete(id);
        if (!deletedReservation) {
            return res.status(404).send({ message: "Reservation not found "});
        } else {
            res.status(200).send({ message: "This reservation is deleted"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error "});
    }
});

module.exports = router;
