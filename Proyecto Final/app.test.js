import supertest from "supertest";
import app from "./app.js";

describe("ROUTER /products", () => {
    describe("GET /list/:id", () => {
        describe("Get all available products", () => {
            test("Should respond with a json object containing an array of products", async () => {
                const response = await request(app).get("/list");
                expect(typeof response).toBe(JSON);
            });
            // Should respond with a 200 status code
            test("Should specify json in the content type header", () => {
                const response = await request(app).get("/list");
                expect(response.headers["content-type"]).toEqual(
                    expect.stringContaining("json")
                );
            });
        });
        describe("Get an available product with the id", () => {});
        describe("Get an unavailable product with the id", () => {});
    });
    describe("POST /add", () => {});
    describe("PUT /update/:id", () => {});
    describe("DELETE /delete/:id", () => {});
});

describe("ROUTER /cart", () => {
    describe("GET /list/:id", () => {});
    describe("POST /add/:id", () => {});
    describe("DELETE /delete/:id", () => {});
});
