import { products } from "../../modules/products/model.js";

class Products {
    #products;

    constructor(products) {
        this.#products = products || [];
    }

    async getProducts(id) {
        this.#products = await products.find();
        if (id) {
            const product = await products.findById(id);

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
        return await products.create(product);
    }

    async updateProduct(product) {
        const res = await products.updateOne(
            { _id: product.id },
            { $set: { ...product } }
        );

        return res || { error: "Product doesn't exist" };
    }

    async deleteProduct(id) {
        const deletedItem = await products.deleteOne({ _id: id });
        return deletedItem || { error: "Product doesn't exist" };
    }
}

export default Products;
