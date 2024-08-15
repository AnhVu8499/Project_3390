const mongoose = require("mongoose")
require("dotenv").config();

const uri = process.env.DB;

module.exports = () => {
    try {
        mongoose.connect(uri);
        console.log("Connected to db successfully");
    } catch (error) {
        console.log(error);
        console.log("Could not connect to db");
    }
};