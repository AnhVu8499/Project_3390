require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const connection = require('./db')
const serverless = require('serverless-http');
const serviceRoutes = require("./routes/service")
const { app } = require('./models/service')

connection()
//mongoose.connect("mongodb+srv://anhvu:Supersentai3@cluster0.nmvm044.mongodb.net/salon")

// middlewares
app.use(express.json());

app.use("/", serviceRoutes)
app.get('/api', (req, res) => {
    res.send('Hello from Express!');
}); 
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log("Server is running!!!");
})