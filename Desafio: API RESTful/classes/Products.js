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

    updateProduct(product) {
        const productIndex = this.#products.findIndex(element => element?.id == product.id)
        if(productIndex !== -1) {
            this.#products[productIndex] = product
            return {
                message: "Product has been updated",
                data: product
            }
        } else {
            return {
                error: "Product doesn´t exist"
            }
        }
    }

    deleteProduct(id) {
        const productIndex = this.#products.findIndex(product => product?.id == id)
        if(productIndex !== -1) {
            const product = this.#products[productIndex]
            this.#products.splice(productIndex, 1)
            return {
                message: "Product has been deleted",
                data: product
            }
        } else {
            return {
                error: "Product doesn´t exist"
            }
        }
    }
}

export default Products