// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from "express";
import serverless from "serverless-http";

const app = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

app.use("/api/", router);
const mongoose = require('mongoose');
app.use(bodyParser.json());

app.use((req, res, next) => {
    // Attach CORS headers
    // Required when using a detached backend (that runs on a different domain)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

const Schema = mongoose.Schema

const notaSchema = new Schema({
    autor: {type: String, required: true},
    body: {type: String, required: true}
})

Nota = mongoose.model('Nota', notaSchema)

router.get('/posts', async (req, res) => {
    const storedPosts = await Nota.find({});
    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
    res.json({ posts: storedPosts });
  });

router.post('/posts', async (req, res) => {
    const postData = req.body;
    try{
        const guardarNota = await Nota.create(postData);
        res.status(200).json(guardarNota)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

mongoose.connect(process.env.MONGO_URI)
    .catch((error) =>{
        console.log(error);
    })


export const handler = serverless(app);
