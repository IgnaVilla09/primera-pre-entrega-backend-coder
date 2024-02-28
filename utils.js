import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getDatos(ruta) {
  if (fs.existsSync(ruta)) {
    return JSON.parse(fs.readFileSync(ruta, "utf-8"));
  } else {
    return [];
  }
}

function saveDatos(ruta, datos) {
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 5));
}

export { getDatos, saveDatos, __dirname };
