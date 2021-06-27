const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5000;

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://blog:Z5NZxLbgpMkDUeG5@cluster0.hcvpx.mongodb.net/blog?retryWrites=true&w=majority";

const app = express();

app.use(cors());
app.use(bodyParser.json());






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("blog").collection("blogpost");

  app.get('/blogs', (req, res) => {
    collection.find()
      .toArray((err, document) => {
        res.status(200).send(document);
        console.log(document)
       
      })
  })

  app.get('/singleBlog/:id',(req, res)=>{
    
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.status(200).send(documents[0])
    })
    
  })

  app.post('/createPost', (req, res) => {
    const post = req.body;
    console.log("new post", post)
    collection.insertOne(post)
      .then(result => {
        console.log(result);
        res.status(200).send(result.insertedCount > 0)

      })


  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.status(200).send(result.deletedCount > 0)
      })
  })
  // perform actions on the collection object
  console.log("db got connecteed")
  
});

app.get('/',(req, res)=>{
    res.send("how you doin")
})
app.listen(port , ()=>{
    console.log(`all good running on ${port}`)
})