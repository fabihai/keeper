const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');

const cors = require("cors");
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { Schema } = mongoose;
const noteSchema = new Schema({
    key: {type: Number, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true}
})

// converts noteSchema into a model that we can work with
const Note = mongoose.model('Note', noteSchema);

const uri ="mongodb+srv://fabihaislam10:classcluster@classcluster.u3xofqg.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);
const db = client.db("test");
mongoose.connect(uri);

// async because we don't know how long it will take to connect
async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB")
        app.listen(5000, () => {console.log("Server started on port 5000");});
    } catch (error) {
        console.error(error);
    }
}

app.get("/api", async (req, res) => {
    
    const data = await db.collection("notes").find().toArray();
    res.send(data);
});

app.post("/api/postData", async (req, res) => {
    console.log("req received");
    const data = req?.body;
    const doc = new Note({ title: data.title, content: data.content })
    const result = await db.collection("notes").insertOne(doc);
    res.send(result);
});

app.post("/api/deleteData", async (req, res) => {
    const noteToDelete = req?.body;
    try {
        Note.deleteOne({_id:noteToDelete.userId}).then(function() {
            console.log("Note deleted");
        }).catch(function(error) {
            console.log(error);
        });
        res.send({status: 200});
    } catch (error) {
        console.log(error);
    }
});

main().catch(console.error);