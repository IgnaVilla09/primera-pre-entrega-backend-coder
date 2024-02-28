import { getDatos, saveDatos } from "../utils.js";

class ProductManager {
  constructor(ruta) {
    this.ruta = ruta;
  }

  getProducts() {
    return getDatos(this.ruta);
  }

  getProductById(productId) {
    const products = this.getProducts();
    return products.find((product) => product.id === productId);
  }
  createProduct(product) {
    let products = this.getProducts();

    let id = 1;
    if (products.length > 0) {
      id = Math.max(...products.map((product) => product.id)) + 1;
    }

    let nuevoProducto = {
      id,
      ...product,
      status: product.status !== undefined ? product.status : true,
    };

    products.push(nuevoProducto);
    saveDatos(this.ruta, products);

    return nuevoProducto;
  }

  updateProduct(updatedProduct) {
    let products = this.getProducts();
    const index = products.findIndex(
      (product) => product.id === updatedProduct.id
    );

    if (index !== -1) {
      const updatedStatus =
        updatedProduct.status !== undefined
          ? updatedProduct.status
          : products[index].status;

      const updatedProductWithStatus = {
        ...updatedProduct,
        status: updatedStatus,
      };

      products[index] = updatedProductWithStatus;

      saveDatos(this.ruta, products);

      return updatedProductWithStatus;
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  deleteProduct(productId) {
    let products = this.getProducts();
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    saveDatos(this.ruta, updatedProducts);
  }
}

export default ProductManager;
