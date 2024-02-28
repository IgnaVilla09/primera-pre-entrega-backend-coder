import { Router } from "express";
import { join } from "path";
import CartManager from "../managers/cartManager.js";
import ProductManager from "../managers/productManager.js";
import { __dirname as rutaBase } from "../utils.js";

const router = Router();

let rutaCarts = join(rutaBase, "data", "cart.json");
const cartManager = new CartManager(rutaCarts);
let rutaProducts = join(rutaBase, "data", "products.json");
const productManager = new ProductManager(rutaProducts);

//Creación de carrito
router.post("/", (req, res) => {
  let cart = cartManager.createProductsForCart();

  let { limit, skip } = req.query;

  if (skip && skip > 0) {
    cart.products = cart.products.slice(skip);
  }

  if (limit && limit > 0) {
    cart.products = cart.products.slice(0, limit);
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(cart);
});

//Obtener lista de productos que contiene el carrito elegido mediante ID
router.get("/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid);

  const cart = cartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const products = cart.products
    .map((item) => {
      const product = productManager.getProductById(item.productId);
      if (!product) {
        console.error("Producto no encontrado con ID:", item.productId);
        return null;
      }
      return product;
    })
    .filter(Boolean);

  res.status(200).json({ products });
});

//Agrega productos al carrito
router.post("/:cid/products/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  let quantity = 1;

  // Verifica si el carrito existe
  const cart = cartManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  // Verifica si el producto existe
  const product = productManager.getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Verifica si el producto ya está en el carrito
  const existingProductIndex = cart.products.findIndex(
    (item) => item.productId === productId
  );

  // Si el producto ya está en el carrito aumenta quantity
  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += quantity;
  } else {
    // Si el producto no está en el carrito lo agrega
    cart.products.push({ productId, quantity });
  }

  // Guarda el carrito actualizado
  cartManager.updateCart(cart);
  res.status(200).json(cart);
});

export { router };
