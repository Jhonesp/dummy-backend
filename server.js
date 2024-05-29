const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
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

app.get('/', (req, res) =>{
    res.json({mssg: 'Welcome to the app'})
} )

const Schema = mongoose.Schema

const notaSchema = new Schema({
    autor: {type: String, required: true},
    body: {type: String, required: true}
})

Nota = mongoose.model('Nota', notaSchema)

app.get('/posts', async (req, res) => {
    const storedPosts = await Nota.find({});
    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
    res.json({ posts: storedPosts });
  });

app.post('/posts', async (req, res) => {
    const postData = req.body;
    try{
        const guardarNota = await Nota.create(postData);
        res.status(200).json(guardarNota)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

app.delete('/delete/:id', async(req, res) =>{
    const idDelete = req.params.id;
    try{
        const res = await Nota.deleteOne({ _id: idDelete });
        res.status(200).json(Nota)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(3000, ()=>{
            console.log("listening on port ", 3000);
        })
    })
    .catch((error) =>{
        console.log(error);
    })

module.exports.app

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
  
  const handler = (req, res) => {
    const d = new Date()
    res.end(d.toString())
  }
  
  module.exports = allowCors(handler)
