class ProductsDTO {
    constructor(product) {
        this.id = product?._id;
        this.title = product?.title;
        this.thumbnail = product?.thumbnail;
        this.price = product?.price;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    getPrice() {
        return this.price;
    }
}

export default ProductsDTO;
