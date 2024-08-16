require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const connection = require('./db')
const serverless = require('serverless-http');
const serviceRoutes = require("./routes/service")
const cors = require('cors')
const { app } = require('./models/service')

connection()

// middlewares
app.use(express.json());
app.use(cors({
    origin: 'https://salonfe.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use("/main", serviceRoutes)
app.get('/api', (req, res) => {
    res.send('Hello from Express!');
}); 
app.get("/", async (req, res) => {
    try {
        const services = await Service.find({});
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log("Server is running!!!");
})