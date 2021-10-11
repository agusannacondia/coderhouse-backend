import ProductsDAO from "./productsDAO.js";
import { products } from "../model.js";
import ProductsDTO from "../dto/productsMongoDTO.js";

class ProductsMongoDAO extends ProductsDAO {
    constructor() {
        super();
    }

    async addProduct(data) {
        return await products.create(data);
    }

    async getProduct(id) {
        const product = await products.findById(id);
        return new ProductsDTO(product);
    }

    async getProducts() {
        const productsFinded = await products.find();
        return productsFinded.map((p) => new ProductsDTO(p));
    }

    async updateProduct(id, toUpdate) {
        return await products.findByIdAndUpdate(id, toUpdate);
    }

    async deleteProduct(id) {
        return await products.findByIdAndDelete(id);
    }
}

export default ProductsMongoDAO;
