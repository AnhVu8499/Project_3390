require("dotenv").config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const connection = require('./db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const serviceRoutes = require("./routes/service");
const reservationRoutes = require("./routes/reservation");
const adminRoutes = require('./routes/admin'); // Assuming you put the route in authRoutes.js

const app = express();

connection();
app.use(express.json());

app.use(session({
    secret: process.env.KEY, // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
}));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use("/storage", reservationRoutes);
app.use("/main", serviceRoutes);
app.use('/admin', adminRoutes);

app.get('/api', (req, res) => {
    res.send('Hello from Express!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
