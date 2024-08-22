const router = require("express").Router();
const Reservation = require('../models/reservation');

// POST /storage
router.post("/", async (req, res) => {
    try {
        const { name, phone, date, time } = req.body;
        const newReservation = new Reservation({ name, phone, date: new Date(date), time });
        await newReservation.save();
        res.status(201).send({ message: "Reservation created successfully", reservation: newReservation });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.find({});
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
