const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c1i4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('resort');
        const servicesCollection = database.collection('villas');
        const activitiesCollection = database.collection('activities');
        const bookingCollection = database.collection('bookings');
        //GET API
        app.get('/villas', async (req, res) => {
            const cursor = servicesCollection.find({});
            const villas = await cursor.toArray();
            res.send(villas);
        })
        //Get activities api
        app.get('/activities', async (req, res) => {
            const cursor = activitiesCollection.find({});
            const activities = await cursor.toArray();
            res.send(activities);
        })
        //get booking api
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })
        //GET Single Api
        app.get('/villas/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting a villa', id);
            const query = { _id: ObjectId(id) };
            const villa = await servicesCollection.findOne(query);
            res.json(villa);
        })
        //POST API
        app.post('/villas', async (req, res) => {
            const villa = req.body;
            const result = await servicesCollection.insertOne(villa);
            res.json(result);
        });
        //Add activities api
        app.post('/activities', async (req, res) => {
            const activity = req.body;
            const result = await activitiesCollection.insertOne(activity);
            res.json(result);
        });
        //Add order details
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        })
        //Delete api
        app.delete('/villas/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        //Update api
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateStatus = {
                $set: {
                    status: 'Confirmed'
                }
            };
            const result = await bookingCollection.updateOne(filter, updateStatus, options);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Markas resort Server Connected')
})

app.listen(port, () => {
    console.log(`Site Listening at http://localhost:${port}`)
})