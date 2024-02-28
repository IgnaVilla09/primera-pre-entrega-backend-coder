import { getDatos, saveDatos } from "../utils.js";

class CartManager {
  constructor(ruta) {
    this.ruta = ruta;
  }

  getAllCarts() {
    return getDatos(this.ruta);
  }

  getCartById(cartId) {
    const carts = this.getAllCarts();
    return carts.find((cart) => cart.id === cartId);
  }

  updateCart(cart) {
    const carts = this.getAllCarts();
    const index = carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      carts[index] = cart;
      saveDatos(this.ruta, carts);
      return true;
    }
    return false;
  }

  createProductsForCart() {
    let carts = this.getAllCarts();

    let id = 1;
    if (carts.length > 0) {
      id = Math.max(...carts.map((cart) => cart.id)) + 1;
    }

    let nuevoCarrito = {
      id,
      products: [],
    };

    carts.push(nuevoCarrito);
    saveDatos(this.ruta, carts);
    return nuevoCarrito;
  }
}

export default CartManager;
