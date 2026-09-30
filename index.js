const express = require("express");

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db("CourseFlow");
const coursesCollection = database.collection("courses");

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

connectToDatabase();

app.use(express.static("client/dist"));

app.get("/api/courses", async (req, res) => {
    const courses = await coursesCollection.find().toArray();

    res.json(courses);
});

app.post("/api/courses", async (req, res) => {
    try {
        const course = req.body;

        const result = await coursesCollection.insertOne(course);

        res.status(200).json({
            message: "Course received successfully",
            course: {
                ...course,
                _id: result.insertedId.toString()
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/courses/:id", async (req, res) => {
    const courseId = req.params.id;
    const updatedCourse = req.body;

    const result = await coursesCollection.updateOne(
        { _id: new ObjectId(courseId) },
        { $set: updatedCourse }
    );

    res.json({
        message: "Course updated successfully",
        modifiedCount: result.modifiedCount
    });
});

app.delete("/api/courses/:id", async (req, res) => {
    const courseId = req.params.id;

    const result = await coursesCollection.deleteOne({
        _id: new ObjectId(courseId)
    });

    res.json({
        message: "Course deleted successfully",
        deletedCount: result.deletedCount
    });
});

app.get("/{*splat}", (req, res) => {
    res.sendFile("index.html", { root: "client/dist" });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Courserve server running on port ${PORT}`);
    });
}

module.exports = { app, client, coursesCollection };