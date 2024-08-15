const mongoose = require('mongoose')
const express = require('express')
const app = express()

// middlewares
app.use(express.json())

const serviceSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

const Service = mongoose.model("service", serviceSchema)

app.get('/', async (req, res) => {
    try {
        console.log("GET /")
        const services = await Service.find({})
        res.status(200).json(services);
        //const service = await Service.find({})
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error')
    }
})

module.exports = { Service, app }