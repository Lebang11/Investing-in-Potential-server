// const express = require('express');
// const router = express();

// router.post('/', async (req, res) => {
//     const imagename = req.body.imagename
//     console.log(imagename)
//     const newImage = await Images.create({imagename})
//     res.status(201)
//     res.json({"message":`new pic: ${newImage}`})
// })

// router.get('/', async (req, res) => {
//     const images = await Images.find({})
//     res.json(images)
// })

// module.exports = router;