import { Router } from "express";
import { join } from "path";
import ProductManager from "../managers/productManager.js";
import { __dirname as rutaBase } from "../utils.js";

const router = Router();

let rutaProducts = join(rutaBase, "data", "products.json");
const productManager = new ProductManager(rutaProducts);

//Muestra de todos los productos
router.get("/", (req, res) => {
  let products = productManager.getProducts();

  let { limit, skip } = req.query;

  if (skip && skip > 0) {
    products = products.slice(skip);
  }

  if (limit && limit > 0) {
    products = products.slice(0, limit);
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ products });
});

//Muestra de productos según ID
router.get("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
  } else {
    res.status(200).json(product);
  }
});

//Creación de productos
router.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;
  if (!title) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Complete el nombre` });
  }

  if (isNaN(code)) {
    return res
      .status(400)
      .json({ error: "Por favor, el código debe ser numérico" });
  }

  const products = productManager.getProducts();
  const codeExists = products.some((product) => product.code === code);
  if (codeExists) {
    res.status(400).json({ error: "El código ya está registrado" });
    return;
  }

  if (isNaN(price)) {
    return res
      .status(400)
      .json({ error: "Por favor, el precio debe ser numérico" });
  }

  if (isNaN(stock)) {
    return res
      .status(400)
      .json({ error: "Por favor, el stock debe ser numérico" });
  }

  const nuevoProducto = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails: thumbnails || {},
  };

  const productoCreado = productManager.createProduct(nuevoProducto);

  res.setHeader("Content-Type", "application/json");
  res.status(201).json({ productoCreado });
});

//Actualización de productos según ID elegido
router.put("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const productModified = productManager.getProductById(productId);

  if (!productModified) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  const nuevoProductoModificado = {
    id: productId,
    title: title || productModified.title,
    description: description || productModified.description,
    code: code || productModified.code,
    price: price || productModified.price,
    stock: stock || productModified.stock,
    category: category || productModified.category,
    thumbnails: thumbnails || productModified.thumbnails,
  };

  const productoModificado = productManager.updateProduct(
    nuevoProductoModificado
  );

  res.status(200).json(productoModificado);
});

//Eliminar productos según ID
router.delete("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const productToDelete = productManager.getProductById(productId);

  if (!productToDelete) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  productManager.deleteProduct(productId);

  res.status(200).json({ message: "Producto eliminado correctamente" });
});

export { router };
