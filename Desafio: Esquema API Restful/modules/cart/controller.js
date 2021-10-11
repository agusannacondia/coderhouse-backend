import fs from "fs";
import Products from "../products/controller";

const products = new Products();

class Cart {
    constructor() {
        try {
            fs.writeFile(`./storage/cart.json`, "[]", { flag: "wx" }, (err) => {
                console.log(
                    err
                        ? "File already exists"
                        : "File has been created correctly"
                );
            });
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }

    async getCarts() {
        try {
            const dataJson = await fs.promises.readFile(
                "./storage/cart.json",
                "utf-8"
            );
            const data = JSON.parse(dataJson);

            if (!Array.isArray(data))
                return { error: "Error trying to read database" };

            return data;
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }

    async getCart(id) {
        try {
            const dataJson = await fs.promises.readFile(
                "./storage/cart.json",
                "utf-8"
            );
            const data = JSON.parse(dataJson);

            if (!Array.isArray(data))
                return { error: "Error trying to read database" };

            const cart = data.find((cart) => cart.id == id);

            if (typeof cart !== "object")
                return { error: "Error trying to read database" };

            return cart;
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }

    async addItem(idItem, idCart) {
        try {
            const cart = await this.getCart(idCart);

            if (cart.error) return { error: "Cart doesn't exist in database" };

            const item = await products.getProduct(idItem);

            if (item.error)
                return { error: "Product doesn't exist in database" };

            cart.items.push({
                id: item.id,
                timestamp: Date.now(),
                title: item.title,
                description: item.description,
                code: item.code,
                thumbnail: item.thumbnail,
                amount: item.amount,
                quantity: 1,
            });

            const carts = await this.getCarts();

            console.log(carts);

            carts = carts.map((element) =>
                element.id == idCart ? cart : element
            );

            console.log(carts);

            await fs.promises.writeFile(
                "./storage/cart.json",
                JSON.stringify(carts)
            );
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }

    async deleteItem(idItem, idCart) {
        try {
            const cart = await this.getCart(idCart);

            if (cart.error) return { error: "Cart doesn't exist in database" };

            const itemInCart = cart.items?.find((item) => {
                return item.id == idItem;
            });

            if (!itemInCart) return { error: "Product doesn't exist in cart" };

            cart.items.splice(cart.items.indexOf(itemInCart), 1);

            const carts = this.getCarts();

            carts = carts.map((element) =>
                element.id == idCart ? cart : element
            );

            await fs.promises.writeFile(
                "./storage/cart.json",
                JSON.stringify(carts)
            );
        } catch (error) {
            return { error: "Error trying to read database" };
        }
    }
}

export default Cart;
