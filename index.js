const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const app = express()
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(cors());

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
    const id = req.params.id;
    try {
        const result = await Nota.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send('Post not found');
        }

        res.status(200).send('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Internal Server Error');
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
