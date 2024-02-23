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

        const db = client.db('super-chat')
        const usersCollection = client.db('super-chat').collection('users');
        const messagesCollection = client.db('super-chat').collection('messages');

        app.get('/', (req, res) => {
            res.send({ status: 'Server running...' })
        })
        app.post('/addusers', async (req, res) => {
            const userData = req.body;
            const result = await usersCollection.insertOne(userData);
            res.send(result);
        })
        app.get('/allmembers', async (req, res) => {
            const result = await usersCollection.find({}).toArray();
            res.send(result);
        })
        app.get('/mymembers', async (req, res) => {
            const email = req.query.email;
            const messages = await messagesCollection.find({ $or: [{ sender: email }, { receiver: email }] }).toArray();
            const emailList = []
            messages.map(message => {
                if (emailList.includes(message.sender) == false) {
                    if (message.sender !== email) {
                        emailList.push(message.sender)
                    }
                }
                if (emailList.includes(message.receiver) == false) {
                    if (message.receiver !== email) {
                        emailList.push(message.receiver)
                    }
                }
            })
            console.log(emailList)
            const users = await usersCollection.find({ email: { $in: emailList } }).toArray();
            res.send(users)
        })
        app.get('/messagehistory', async (req, res) => {
            const id = req.query.id;
            const email1 = req.query.email;
            const userInfo = await usersCollection.findOne({ _id: ObjectId(id) });
            const email2 = userInfo.email;
            console.log(email1, email2);
            const messages = await messagesCollection.find({ $or: [{ sender: email1, receiver: email2 }, { sender: email2, receiver: email1 }] }).toArray();
            console.log('messages: ', messages);
            res.send({ userInfo: userInfo, messages: messages })
        })

        app.post('/messageadd',async (req, res) => {
            const message = req.body;
            const result = await messagesCollection.insertOne(message)
            res.send(result);
        })

    }
    finally { }
}


run()

app.listen(port, () => {
    console.log('PORT', port)
})