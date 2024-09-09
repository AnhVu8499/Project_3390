const router = require("express").Router();
const Reservation = require('../models/reservation');
const nodemailer = require('nodemailer');

// Temporary in-memory storage for verification codes
const pendingVerify = {};
const MAX_ATTEMPTS = 3;

// Add reservation and send verification code
router.post("/", async (req, res) => {
    try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
        const { name, email, date, time, service } = req.body;

        // Store pending verification data
        pendingVerify[email] = { name, email, date, time, service, verificationCode, retryCount:0 };

        // Send verification code via email
        await sendVerificationEmail(email, verificationCode);

        res.status(201).send({ message: "Reservation created successfully, confirmation is sent to email" });
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
        // from: process.env.USER,
        from: '"Paris Nails Spa" <no-reply@parisnails.com>',
        to,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`
    });
};

const confirmation = async (to, name, date, time, service) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:process.env.USER,
            pass:process.env.PASS
        }
    });

    await transporter.sendMail({
        from:"Paris Nails Spa",
        to,
        subject:'Reservation confirmation',
        html:
        `<form> 
            <div> Your reservation is here </div>
            <div> <strong>Name</strong>: ${name}</div>
            <div> <strong>Date</strong>: ${date}</div>
            <div> <strong>Time</strong>: ${time}</div>
            <div> <strong>Service</strong>: ${service}</div>
        </form>`

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
        const { name, date, time, service } = pendingReservation;
        const newReservation = new Reservation({ name, email, date: new Date(date), time, service, verified: true });

        await newReservation.save();

        // Send confirmation email after successful verification
        await confirmation(email, name, date, time, service, code);

        // Remove the pending reservation from memory after successful verification
        delete pendingVerify[email];

        res.status(200).send({ message: "Email verified and reservation saved successfully" });
    } else {
        pendingReservation.retryCount = (pendingReservation.retryCount || 0) + 1;

        if (pendingReservation.retryCount >= MAX_ATTEMPTS) {
            // If maximum attempts reached, discard the reservation
            delete pendingVerify[email];
            res.status(400).send({ message: "Invalid verification code, reservation discarded after multiple attempts" });
        } else {
            res.status(400).send({ message: `Invalid verification code. You have ${MAX_ATTEMPTS - pendingReservation.retryCount} attempts left.` });
        }
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

// Delete info manually
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

router.delete("/autoDelete", async (req, res) => {
    try {
        const today = new Date();
        const result = await Reservation.deleteMany({ date: { $lt: today }});
        if (result.deletedCount > 0) {
            res.status(200).send({ message: `${result.deletedCount} past reservations deleted` });
        } else {
            res.status(404).send({ message: "No past reservations found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
})

module.exports = router;
