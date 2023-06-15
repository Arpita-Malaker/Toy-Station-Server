const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middlewire

app.use(cors());
app.use(express.json());


//MONGOBD connect driver start ==============


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utsqttn.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        //toydb 
        const toyCollection = client.db("ToyStationdb").collection("toys");

        //toys api get
         app.get('/toys', async(req,res)=>{
            const result = await toyCollection.find().toArray();
            res.send(result);
         })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


//MONGOBD connect driver end ==============

app.get('/', (req, res) => {
    res.send('station is running')
})

app.listen(port, () => {
    console.log(`station running on port ${port}`)
})

