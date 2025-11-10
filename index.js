const express = require("express");
const app = express();
let cors = require("cors");
const port = process.env.PORT || 9000;
app.use(cors());
app.use(express.json());
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@crud.p5kddzk.mongodb.net/?appName=CRUD`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/load", (req, res) => {
  res.send("hello i am here");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});



async function run() {
  try {
   

   let db = client.db("KrishiLink")
   let dbCollection = db.collection('allCrops')


   app.get("/allcrops", async(req, res)=>{
     
     let result = await dbCollection.find().toArray()
     res.send(result)
   })

   app.get("/allcrops/:id", async(req, res)=>{
      let id = req.params.id
      let objectId = new ObjectId(id)
      let result = await dbCollection.findOne({_id:objectId})
      res.send(result)
   })




    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("mongodb connectttttttttttttttt");
  } finally {
    
  }
}
run().catch(console.dir);