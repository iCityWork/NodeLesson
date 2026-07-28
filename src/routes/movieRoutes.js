import express from "express";

const router = express.Router()

router.get('/', (req,res) =>{
    res.json({ httpMethod: 'GET request'})
})

router.post('/', (req,res) =>{
    res.json({httpMethod: 'POST request'})
})

router.delete('/', (req, res) =>{
    res.json({httpMethod: "DELETE request"})
})

router.put('/', (req, res) =>{
    res.json({httpMethod: "PUT request"})
})


export default router