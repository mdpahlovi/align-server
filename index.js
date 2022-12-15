require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

// Middle Wire
app.use(cors());
app.use(express.json());

const uri = process.env.DB_Url;
const client = new MongoClient(uri);

const database = async () => {
    const taskCollection = client.db("align").collection("tasks");

    // Store & Update User To db
    app.put("/task/:email", async (req, res) => {
        const { email } = req.params;
        const user = req.body;
        const filter = { user_email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: user,
        };
        const result = await taskCollection.updateOne(filter, updateDoc, options);
        if (result.upsertedCount) {
            res.send("New Task Added");
        } else if (result.modifiedCount) {
            res.send("Task Updated");
        }
    });

    // Get All Task
    app.get("/tasks", async (req, res) => {
        const curser = taskCollection.find({});
        const tasks = await curser.toArray();
        res.send(tasks);
    });

    // Delete Task By Email
    app.delete("/task/:email", async (req, res) => {
        const { email } = req.params;
        const filter = { user_email: email };
        const result = await taskCollection.deleteOne(filter);
        if (result.deletedCount) {
            res.send("Successfully Deleted");
        }
    });

    app.get("/task/:email", async (req, res) => {
        const { email } = req.params;
        const filter = { user_email: email };
        const task = await taskCollection.findOne(filter);
        res.send(task);
    });
};
database().catch((err) => console.log(`${err.name} ${err.message}`));

app.get("/", (req, res) => {
    res.send("Server Running Done");
});

app.listen(process.env.PORT || 5000);
