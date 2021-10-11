import supertest from "supertest";
import chai from "chai";
import app from "./app.js";

const expect = chai.expect;

const request = supertest(app);

describe("Test API", () => {
    describe("GET /productos/listar", () => {
        it("Should return status code: 200", async () => {
            const response = await request.get("/api/productos/listar");
            expect(response?.status).to.eql(200);
        });

        it("Should return list", async () => {
            let response = await request.get("/api/productos/listar");
            expect(typeof response?.body).to.eql("object");
        });
    });

    describe("GET /productos/listar/:id", () => {
        it("Should return status code: 200", async () => {
            const testObject = await request
                .post("/api/productos/guardar")
                .send({
                    title: "test",
                    thumbnail: "test",
                    price: 0,
                });

            const response = await request.get(
                `/api/productos/listar/${testObject?.body?._id}`
            );
            expect(response?.status).to.eql(200);
        });

        it("Should return list", async () => {
            const testObject = await request
                .post("/api/productos/guardar")
                .send({
                    title: "test",
                    thumbnail: "test",
                    price: 0,
                });

            const response = await request.get(
                `/api/productos/listar/${testObject?.body?._id}`
            );
            expect(typeof response?.body).to.eql("object");
        });
    });

    describe("POST /productos/guardar", () => {
        it("Should return status code: 200", async () => {
            const response = await request.post("/api/productos/guardar").send({
                title: "test",
                thumbnail: "test",
                price: 0,
            });
            expect(response?.status).to.eql(200);
        });

        it("Should return list", async () => {
            const response = await request.post("/api/productos/guardar").send({
                title: "test",
                thumbnail: "test",
                price: 0,
            });
            expect(typeof response?.body).to.eql("object");
        });
    });

    describe("PUT /productos/actualizar/:id", () => {
        it("Should return status code: 200", async () => {
            const testObject = await request
                .post("/api/productos/guardar")
                .send({
                    title: "test",
                    thumbnail: "test",
                    price: 0,
                });

            const response = await request.put(
                `/api/productos/actualizar/${testObject?.body?._id}`,
                {
                    title: "test 2",
                    thumbnail: "test 2",
                    price: 0,
                }
            );
            expect(response?.status).to.eql(200);
        });

        it("Should return list", async () => {
            const testObject = await request
                .post("/api/productos/guardar")
                .send({
                    title: "test",
                    thumbnail: "test",
                    price: 0,
                });

            const response = await request.put(
                `/api/productos/actualizar/${testObject?.body?._id}`,
                {
                    title: "test 2",
                    thumbnail: "test 2",
                    price: 0,
                }
            );
            expect(typeof response?.body).to.eql("object");
        });
    });

    describe("DELETE /productos/borrar/:id", () => {
        it("Should return status code: 200", async () => {
            const testObjectToDelete = await request
                .post("/api/productos/guardar")
                .send({
                    title: "test",
                    thumbnail: "test",
                    price: 0,
                });

            const response = await request.delete(
                `/api/productos/borrar/${testObjectToDelete?.body._id}`
            );
            expect(response?.status).to.eql(200);
        });

        it("Should return list", async () => {
            const testObjectToDelete = await request
                .post("/api/productos/guardar")
                .send({
                    title: "test",
                    thumbnail: "test",
                    price: 0,
                });

            const response = await request.delete(
                `/api/productos/borrar/${testObjectToDelete?.body?._id}`
            );
            expect(typeof response?.body).to.eql("object");
        });
    });
});
