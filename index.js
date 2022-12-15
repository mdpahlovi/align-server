require("dotenv").config();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();

// Middle Wire
app.use(cors());
app.use(express.json());

const uri = process.env.DB_Url;
const client = new MongoClient(uri);

const database = async () => {
    const taskCollection = client.db("align").collection("tasks");
    await taskCollection.insertOne({ name: "Pahlovi" });
};
database().catch((err) => console.log(`${err.name} ${err.message}`));

app.get("/", (req, res) => {
    res.send("Server Running Done");
});

app.listen(process.env.PORT || 5000);
