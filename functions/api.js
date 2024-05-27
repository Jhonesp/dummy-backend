const express = require('express');
const serverless = require('serverless-http');
const app = express();

const mongoose = require('mongoose');


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

app.get('/.netlify/functions/posts', async (req, res) => {
    const storedPosts = await Nota.find({});
    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
    res.json({ posts: storedPosts });
  });

app.post('/.netlify/functions/posts', async (req, res) => {
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

app.use(bodyParser.json());
const handler = serverless(app);

module.exports.handler = async(event, context) =>{
    const result = await handler(event, context);
    return result;
}