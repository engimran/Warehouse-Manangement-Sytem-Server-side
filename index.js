const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mc2fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db('groceryItem').collection('itemsQty');

        // items shown in UI
        app.get('/itemsQty', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // user wise item shown
        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const items = await itemsCollection.find(query).toArray();
            res.send(items);
        })

        // data load
        app.get('/itemsQty/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.send(item);
        })

        // data insert
        app.post('/itemsQty', async (req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        })

        // data delete

        app.delete('/itemsQty/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

        // update data

        app.put('/itemsQty/:id', async (req, res) => {
            const id = req.params.id;
            const oldQuantity = parseInt(req.query.oldQuantity);
            const query = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateQty = {
                $set: {
                    quantity: oldQuantity - 1
                }
            }
            const result = await itemsCollection.updateOne(query, updateQty, option);
            res.send(result)

        })

    }
    finally {

    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my server side')
})

app.listen(port, () => {
    console.log('Check the Server', port)
})
