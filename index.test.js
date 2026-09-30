const request = require("supertest");
const { app, client, coursesCollection } = require("./index");

describe("Courserve API", () => {
    test("GET /api/courses returns an array", async () => {
        const response = await request(app).get("/api/courses");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }, 15000);
});

afterAll(async () => {
    await coursesCollection.deleteMany({
        code: { $regex: "^TEST" }
    });

    await client.close();
});

test("POST /api/courses creates a course", async () => {
    const newCourse = {
        code: "TEST101",
        name: "Test Course",
        credits: 3,
        completed: false
    };

    const response = await request(app)
        .post("/api/courses")
        .send(newCourse);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Course received successfully");
    expect(response.body.course.code).toBe("TEST101");
    expect(response.body.course._id).toBeDefined();
});

test("PUT /api/courses/:id updates a course", async () => {
    const createResponse = await request(app)
        .post("/api/courses")
        .send({
            code: "TEST102",
            name: "Original Course",
            credits: 3,
            completed: false
        });

    console.log(createResponse.body);

    const courseId = createResponse.body.course._id;

    const response = await request(app)
        .put(`/api/courses/${courseId}`)
        .send({
            name: "Updated Course",
            completed: true
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Course updated successfully");
    expect(response.body.modifiedCount).toBe(1);
});

test("DELETE /api/courses/:id deletes a course", async () => {
    const createResponse = await request(app)
        .post("/api/courses")
        .send({
            code: "TEST103",
            name: "Course To Delete",
            credits: 3,
            completed: false
        });

    console.log(createResponse.body);

    const courseId = createResponse.body.course._id;

    const response = await request(app)
        .delete(`/api/courses/${courseId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Course deleted successfully");
    expect(response.body.deletedCount).toBe(1);
});

test("updated course data persists in MongoDB", async () => {
    const createResponse = await request(app)
        .post("/api/courses")
        .send({
            code: "TEST104",
            name: "Persistence Test",
            credits: 3,
            completed: false
        });

    console.log(createResponse.body);

    const courseId = createResponse.body.course._id;

    await request(app)
        .put(`/api/courses/${courseId}`)
        .send({
            completed: true
        });

    const getResponse = await request(app).get("/api/courses");

    const updatedCourse = getResponse.body.find(
        course => course._id === courseId
    );

    expect(updatedCourse).toBeDefined();
    expect(updatedCourse.completed).toBe(true);
});