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
        const usersCollection = client.db("ToyStationdb").collection("users");

        //post user api
        app.post('/users',  async (req, res) => {

            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
      
            if (existingUser) {
              return res.send({ message: "already exis" })
            }
            const result = await usersCollection.insertOne(user)
            res.send(result);
      
          })

        //toys api get
        //  app.get('/toys', async(req,res)=>{
        //     const result = await toyCollection.find().toArray();
        //     res.send(result);
        //  })

        //sens toy data in server
        app.post('/toys', async (req, res) => {

            const newItem = req.body;
            const result = await toyCollection.insertOne(newItem);
            res.send(result);
          })
      



        //get toy spi
         app.get('/toys', async(req,res)=>{
            // const cursor = serviceCollection.find(query, options);
            // const result = await cursor.toArray();
            const cursor= toyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
         })

         // toys data with id
            // app.get('/toys/:id', async(req,res)=>{
            // const result = await toyCollection.find().toArray();
            // res.send(result);
        //  })
         //delete toy
         app.delete('/toys/:id',async(req,res)=>{
            const id= req.params.id;
            const  ObjectID = require('mongodb').ObjectId;
            console.log(id);
            const query={_id:new  ObjectID(id)}
            console.log(query);
            const r = await toyCollection.deleteOne(query);
            res.send(r);
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

