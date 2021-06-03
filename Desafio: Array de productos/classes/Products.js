class Products {

    #products

    constructor(products = []) {
        this.#products = products
    }

    getProducts() {
        return !!this.#products.length ? this.#products : {error: "There are no products loaded"}
    }

    getProduct(id) {
        return this.#products.find(product => product?.id == id) || {error: "Product doesn´t exist"}
    }

    addProduct(product) {
        this.#products.push({
            ...product,
            id: this.#products.length
        })
    }
}

export default Products