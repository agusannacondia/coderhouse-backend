import knex from "knex";
import { mysql } from "../config/database.js";

const myKnex = knex(mysql);

class Products {
    constructor() {
        try {
            myKnex.schema.hasTable("products").then((exists) => {
                if (!exists) {
                    return myKnex.schema.createTable("products", (table) => {
                        table.increments("id").primary();
                        table.string("title");
                        table.float("price");
                        table.string("thumbnail");
                    });
                }
            });
        } catch (_error) {
            return { error: "Error trying to create table" };
        }
    }

    async getProducts() {
        try {
            const products = await myKnex.from("products").select();

            if (products.length === 0)
                return { error: "There are not products in the database" };

            return products;
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }

    async getProduct(id) {
        try {
            const products = await myKnex.from("products").where("id", "=", id);

            if (products.length === 0)
                return { error: "Product does not exist in database" };

            return products[0];
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }

    async addProduct({ title, price, thumbnail }) {
        try {
            await myKnex("products").insert({
                title,
                price,
                thumbnail,
            });
            return { message: "Product has been added" };
        } catch (err) {
            return { error: "Error trying to save a product" };
        }
    }

    async updateProduct({ id, title = "", price = 0, thumbnail = "" }) {
        try {
            await myKnex
                .from("products")
                .where("id", id)
                .update({ title, price, thumbnail });

            return { message: "Product has been updated" };
        } catch (error) {
            return { error: "Error trying to update a product" };
        }
    }

    async deleteProduct(id) {
        try {
            await myKnex.from("products").where("id", "=", id).del();
            return { message: "Product has been deleted" };
        } catch (error) {
            return { error: "Error trying to delete a product" };
        }
    }
}

export default Products;
