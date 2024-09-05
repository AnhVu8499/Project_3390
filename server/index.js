require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const connection = require('./db');
const cors = require('cors');
const serviceRoutes = require("./routes/service");
const reservationRoutes = require("./routes/reservation");
const path = require('path');

const app = express();

connection();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use("/storage", reservationRoutes);
app.use("/main", serviceRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../client/public')));

// Route to serve the admin.html file
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/admin.html'));
});

app.get('/api', (req, res) => {
    res.send('Hello from Express!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
