import DaoException from "../../../errors/DaoException.js";

class ProductsDAO {
    constructor() {}

    async addProduct(_data) {
        throw new DaoException("addProduct() method is not implemented");
    }

    async getProduct(_id) {
        throw new DaoException("getProduct() method is not implemented");
    }

    async getProducts() {
        throw new DaoException("getProducts() method is not implemented");
    }

    async updateProduct(_id, _toUpdate) {
        throw new DaoException("update() method is not implemented");
    }

    async deleteProduct(_id) {
        throw new DaoException("remove() method is not implemented");
    }
}

export default ProductsDAO;
