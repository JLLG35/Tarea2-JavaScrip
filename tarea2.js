// Cada producto que vende el supermercado es creado con esta clase
class Producto {
  constructor(sku, nombre, precio, categoria, stock = 10) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
  }
}

// Creo todos los productos que vende mi supermercado

const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos simulando una base de datos

const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga al supermercado va a crear un carrito

class Carrito {
  constructor() {
    this.productos = [];
    this.categorias = new Set();
    this.precioTotal = 0;
  }

  // Función que agrega @{cantidad} de productos con @{sku} al carrito
   
  async agregarProducto(sku, cantidad) {
    console.log(`Agregando ${cantidad} ${sku}`);

    try {
      
  // Busco el producto en la "base de datos"

      const producto = await findProductBySku(sku);

      console.log("Producto encontrado:", producto);

  // Verifico si hay suficiente stock

      if (producto.stock < cantidad) {
        throw new Error("No hay suficiente stock disponible.");
      }

  // Busco si el producto ya está en el carrito

      const productoExistente = this.productos.find((p) => p.sku === sku);

      if (productoExistente) {

  // Si el producto ya existe, actualizo la cantidad

        productoExistente.cantidad += cantidad;
      } else {
  
  // Si el producto no existe, lo agrego al carrito

        const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
        this.productos.push(nuevoProducto);
      }

      this.precioTotal += producto.precio * cantidad;

  // Agrego la categoría si no estaba en la lista

      this.categorias.add(producto.categoria);

  // Actualizo el stock del producto

      producto.stock -= cantidad;

      console.log("Producto agregado al carrito.");
    } catch (error) {
      console.log(error);
    }
  }

  // Función que elimina @{cantidad} de productos con @{sku} del carrito
  
  eliminarProducto(sku, cantidad) {
    console.log(`Eliminando ${cantidad} ${sku}`);

    const productoExistente = this.productos.find((p) => p.sku === sku);

    if (!productoExistente) {
      console.log(`El producto ${sku} no existe en el carrito.`);
      return;
    }

    if (cantidad < productoExistente.cantidad) {
      // Restar la cantidad indicada al producto existente
      productoExistente.cantidad -= cantidad;
      this.precioTotal -= productoExistente.precio * cantidad;
      console.log("Cantidad actualizada.");
    } else {
      // Eliminar el producto del carrito
      const index = this.productos.indexOf(productoExistente);
      this.precioTotal -= productoExistente.precio * productoExistente.cantidad;
      this.productos.splice(index, 1);

      console.log("Producto eliminado del carrito.");
    }
  }
}

// Cada producto que se agrega al carrito es creado con esta clase

class ProductoEnCarrito {
  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"

function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find((producto) => producto.sku === sku);
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`Producto ${sku} no encontrado.`);
      }
    }, 1500);
  });
}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2)
  .then(() => {
    console.log("Producto agregado al carrito.");
    return carrito.agregarProducto('WE328NJ', 2);
  })
  .then(() => {
    console.log("Producto agregado al carrito.");
    return carrito.eliminarProducto('WE328NJ', 1);
  })
  .then(() => {
    console.log("Producto eliminado del carrito.");
    console.log("Productos en el carrito:", carrito.productos);
    console.log("Categorías en el carrito:", Array.from(carrito.categorias));
    console.log("Precio total:", carrito.precioTotal);
  })
  .catch((error) => {
    console.log(error);
  });