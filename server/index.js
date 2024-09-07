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
const adminRoutes = require('./routes/admin');
const { Service } = require('./models/service');

const app = express();

connection();
app.use(express.json());

app.use(cors({
    origin: 'https://salonfe.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use("/storage", reservationRoutes);
app.use("/main", serviceRoutes);
app.use('/admin', adminRoutes);

app.get('/services', async (req, res) => {
    try {
      const services = await Service.find(); // Fetch all services from the DB
      res.json(services);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
