const express = require('express')
const app = express()
const port =  process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
// middleware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jspzohs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 async function run(){
    try{
        const database = client.db("volunteerDb");
        const eventsCollection = database.collection("events");
        const volunteersCollection = database.collection("volunteers");

        app.get("/events",async (req,res)=> {
            const query = {};
            const cursor = eventsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post("/events",async(req,res)=> {
           const doc = req.body;
           console.log(doc);
           const result = eventsCollection.insertOne(doc);
           res.send(result);
        })
        app.get("/events/:id",async(req,res)=> {
           const id = req.params.id;
           const query = {_id: ObjectId(id)}
           const result = await eventsCollection.findOne(query);
           res.send(result);
        })
        app.post("/volunteer",async(req,res)=> {
            const data = req.body;
            console.log(data)
            const result = await volunteersCollection.insertOne(data);
            res.send(result);
        })
        app.get("/volunteer",async(req,res)=> {
          const email = req.query.email;
          const query = {email: email}
          const cursor =  volunteersCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        })

        app.delete("/volunteer/:id",async(req,res)=> {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const result = await volunteersCollection.deleteOne(query);
          res.send(result);
             })
      app.get("/volunteers", async(req,res)=> {
        const query = {}
        const cursor = volunteersCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })
    }
    finally{
        // await client.close();
    }
 }

 run()






app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})