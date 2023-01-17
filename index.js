const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.f0acigw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {

        const usersCollection = client.db('super-chat').collection('users');

        app.get('/', (req, res) => {
            res.send({ status: 'Server running...' })
        })

        app.post('/addusers', async (req, res) => {

            const userData = req.body;
            const result = await usersCollection.insertOne(userData);
            console.log(result);
            res.send(result);
        }
        )
    }
    finally { }
}


run()

app.listen(port, () => {
    console.log('PORT', port)
})