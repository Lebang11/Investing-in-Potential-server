const express = require('express');
const Images = require('../../database/Schema/Images')

const router = express()

router.post('/', async (req, res) => {
    const newImage = await Images.create({imagename: req.body.imagename})
    res.status(201)
    res.json({"message":`new pic: ${newImage}`})
})

router.get('/', async (req, res) => {
    const images = await Images.find({})
    res.json(images)
})

module.exports = router;