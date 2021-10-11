import { products as productsModel } from "./model.js";

class Products {
    #products;

    constructor(products) {
        this.#products = products || [];
    }

    async getProducts(id) {
        this.#products = await productsModel.find();
        if (id && id !== "undefined") {
            const product = await productsModel.findById(id);

            return !!product.length
                ? product
                : {
                      error: "Product doesn't exist",
                  };
        }

        return !!this.#products.length
            ? this.#products
            : {
                  error: "There are no products loaded",
              };
    }

    async addProduct(product) {
        return await productsModel.create(product);
    }

    async updateProduct(product) {
        const res = await productsModel.updateOne(
            { _id: product.id },
            { $set: { ...product } }
        );

        return res || { error: "Product doesn't exist" };
    }

    async deleteProduct(id) {
        const deletedItem = await productsModel.deleteOne({ _id: id });
        return deletedItem || { error: "Product doesn't exist" };
    }
}

export default Products;
