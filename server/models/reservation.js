const mongoose = require('mongoose')
const express = require('express')
const app = express()

// middlewares
app.use(express.json())

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    date: {
        type: String,
        required:true
    },
    time: {
        type: String,
        required:true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode :{
        String
    }
})

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;