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
        const productInArray = this.#products.find(element => element?.id == product.id)
        if(productInArray) {
            this.#products = this.#products.map((element) => element.id == product.id ? product : element)
            return {
                message: "Product has been updated"
            }
        } else {
            return {
                error: "Product doesn´t exist"
            }
        }
    }

    deleteProduct(id) {
        const product = this.#products.find(product => product?.id == id)
        if(product) {
            this.#products.splice(this.#products.indexOf(product), 1)
            return {
                message: "Product has been deleted"
            }
        } else {
            return {
                error: "Product doesn´t exist"
            }
        }
    }
}

export default Products