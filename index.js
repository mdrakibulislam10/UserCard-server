const express = require('express');
const app = express();
var cors = require('cors')
const port = 3000 || process.env.PORT;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pqpiudt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        // collections
        const incompleteCollection = client.db("UserCard").collection("incompleteCollection");
        const toDoCollection = client.db("UserCard").collection("ToDoCollection");
        const doingCollection = client.db("UserCard").collection("doingCollection");
        const underReviewCollection = client.db("UserCard").collection("underReviewCollection");
        const completedCollection = client.db("UserCard").collection("completedCollection");

        // incompleteCollection
        app.get("/incomplete", async (req, res) => {
            const incompleteData = await incompleteCollection.find().toArray();
            res.send(incompleteData);
        });
        // toDoCollection
        app.get("/toDo", async (req, res) => {
            const toDoData = await toDoCollection.find().toArray();
            res.send(toDoData);
        });
        // doingCollection
        app.get("/doing", async (req, res) => {
            const doingData = await doingCollection.find().toArray();
            res.send(doingData);
        });
        // underReviewCollection
        app.get("/underReview", async (req, res) => {
            const underReviewData = await underReviewCollection.find().toArray();
            res.send(underReviewData);
        });
        // completedCollection
        app.get("/completed", async (req, res) => {
            const completedData = await completedCollection.find().toArray();
            res.send(completedData);
        });

        // count data

        app.get("/dataCount", async (req, res) => {
            const role = req.query.role;
            const query = { role: role }

            let dataCount;

            if (role === "incomplete") {
                dataCount = await incompleteCollection.countDocuments(query);
            }
            else if (role === "toDo") {
                dataCount = await toDoCollection.countDocuments(query);
            }
            else if (role === "doing") {
                dataCount = await doingCollection.countDocuments(query);
            }
            else if (role === "underReview") {
                dataCount = await underReviewCollection.countDocuments(query);
            }
            else if (role === "complete") {
                dataCount = await completedCollection.countDocuments(query);
            }
            res.send(dataCount.toString());
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('user card is running');
});

app.listen(port, () => {
    console.log(`UserCard is listening on port ${port}`)
});