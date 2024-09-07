const router = require("express").Router();
const { Service } = require('../models/service');

router.post("/", async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        const { service, price, serviceType } = req.body
        const newService = new Service({ service, price, serviceType })
        await newService.save()
        
        res.status(201).send({ message: "Service created successfully", service: newService });
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal server error"})
    }
})

router.get("/", async (req, res) => {
    try {
        const services = await Service.find({});
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});


module.exports = router