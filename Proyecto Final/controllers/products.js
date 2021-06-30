import fs from "fs";

class Products {
    #products;
    constructor() {
        try {
            fs.writeFile(
                `./storage/products.json`,
                "[]",
                { flag: "wx" },
                (err) => {
                    console.log(
                        err
                            ? "File already exists"
                            : "File has been created correctly"
                    );
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async getProducts() {
        try {
            const dataJson = await fs.promises.readFile(
                "./storage/products.json",
                "utf-8"
            );
            const products = JSON.parse(dataJson);

            if (!Array.isArray(products))
                return { error: "Error trying to read database" };

            if (typeof products !== "object")
                return { error: "Error trying to read database" };

            return products;
        } catch (error) {
            throw new Error("Error trying to read database");
        }
    }

    async getProduct(id) {
        try {
            const dataJson = await fs.promises.readFile(
                "./storage/products.json",
                "utf-8"
            );
            const products = JSON.parse(dataJson);

            if (!Array.isArray(products))
                return { error: "Error trying to read database" };

            const product = products.find((product) => product?.id == id);

            if (typeof product !== "object")
                return { error: "Product doesn't exist in database" };

            return product;
        } catch (error) {
            throw new Error("Error trying to read database");
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();

            products.push({
                ...product,
                id: products.length,
            });

            await fs.promises.writeFile(
                `./storage/products.json`,
                JSON.stringify(products)
            );

            return {
                message: "Product has been added correctly",
            };
        } catch (error) {
            return {
                error: "Error has ocurred while trying to save in database",
            };
        }
    }

    async updateProduct(product) {
        try {
            const products = await this.getProducts();
            const productInArray = products.find((item) => {
                return item.id == id;
            });

            if (!productInArray) return { error: "Product doesn´t exist" };

            products = products.map((element) =>
                element.id == product.id ? product : element
            );

            await fs.promises.writeFile(
                `./storage/products.json`,
                JSON.stringify(products)
            );

            return {
                message: "Product has been updated",
            };
        } catch (error) {
            return {
                error: "Error has ocurred while trying to update database",
            };
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((item) => {
                return item.id == id;
            });

            if (!product) return { error: "Product doesn´t exist" };

            products.splice(products.indexOf(product), 1);

            await fs.promises.writeFile(
                `./storage/products.json`,
                JSON.stringify(products)
            );

            return {
                message: "Product has been deleted",
            };
        } catch (error) {
            return {
                error: "Error has ocurred while trying to delete from database",
            };
        }
    }
}

export default Products;
