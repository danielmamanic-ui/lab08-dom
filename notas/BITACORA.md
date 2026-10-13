# Bitacora de JavaScript interactivo

Laboratorio 08: JavaScript Interactivo - DOM, Eventos y Objetos. Navegador usado: Microsoft Edge (motor Chromium), con las herramientas de desarrollo (F12).

## Ejercicio 2: Seleccionar y modificar el DOM

```js
const titulo = document.querySelector("#titulo");
titulo.textContent = "Hola TECSUP";
titulo.style.color = "blue";

const mensaje = document.querySelector(".mensaje");
mensaje.classList.add("destacado");

const lista = document.querySelector("#lista");
const nuevo = document.createElement("li");
nuevo.textContent = "JavaScript";
lista.appendChild(nuevo);
```

| Instruccion | Que cambio en la pantalla | Se mantiene al recargar (Si/No) |
|---|---|---|
| textContent desde la consola | El titulo cambio a "Hola desde la consola" | No |
| textContent desde app.js | El titulo cambio a "Hola TECSUP" | Si |
| style.color | El titulo se pinto de azul (rgb(0, 0, 255)) | Si |
| classList.add | El parrafo .mensaje tomo fondo amarillo (clase destacado, #fff3cd) | Si |
| createElement + appendChild | La lista paso de 2 a 3 elementos: HTML, CSS y JavaScript | Si |

El cambio hecho en la consola solo modifica el DOM que esta en memoria; al recargar, el navegador vuelve a construir el DOM desde index.html y ejecuta otra vez app.js, por eso solo permanecen los cambios escritos en app.js.

## Ejercicio 3: Evento click

```js
btnSumar.addEventListener("click", (evento) => {
  clics = clics + 1;
  contador.textContent = clics;
  console.log(evento.type, evento.target);
});
```

| Tipo de evento | Que accion lo dispara | Cuanto suma por accion |
|---|---|---|
| click | Presionar y soltar el boton una vez | 1 por clic (un doble clic suma 2, porque son dos clics) |
| dblclick | Dos clics rapidos sobre el boton | 1 por doble clic (un clic simple no suma nada) |
| mouseover | Pasar el puntero por encima del boton, sin hacer clic | 1 cada vez que el puntero entra al boton |

- `evento.type` mostro el nombre del evento que ocurrio: `click`, `dblclick` o `mouseover`, segun el que estaba escuchando.
- `evento.target` mostro el elemento que recibio el evento: `<button id="btnSumar">Sumar 1</button>`.

## Ejercicio 4: Eventos input y submit

```js
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!correo.value.includes("@")) {
    resultado.textContent = "Correo no valido: falta @";
    resultado.classList.add("error");
  } else {
    resultado.textContent = "Enviado: " + correo.value;
    resultado.classList.remove("error");
  }
});
```

| Prueba | Que paso en la pantalla | Se recargo la pagina (Si/No) |
|---|---|---|
| Escribir en el campo nombre | "Hola, ..." cambio letra por letra hasta "Hola, Ana" | No |
| Enviar sin preventDefault | "Enviado" aparecio un instante y desaparecio; el campo correo quedo vacio y la URL termino en `?` | Si |
| Enviar con preventDefault, correo sin @ | Aparecio "Correo no valido: falta @" en rojo | No |
| Enviar con preventDefault, correo con @ | Aparecio "Enviado: ana@ejemplo.com" en negro | No |

## Ejercicio 5: Clases y objetos

```js
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  conDescuento(pct) {
    return this.precio * (1 - pct);
  }

  descripcion() {
    return this.nombre + " - S/ " + this.precio.toFixed(2);
  }
}

const monitor = new Producto("Monitor", 680);
const productos = [laptop, mouse, teclado, monitor];
```

| Objeto | nombre | precio | descripcion() | conDescuento(0.25) |
|---|---|---|---|---|
| laptop | Laptop | 2500 | Laptop - S/ 2500.00 | 1875 |
| mouse | Mouse | 45 | Mouse - S/ 45.00 | 33.75 |
| teclado | Teclado | 120 | Teclado - S/ 120.00 | 90 |
| monitor | Monitor | 680 | Monitor - S/ 680.00 | 510 |

Comprobacion con calculadora: 2500 x 0,75 = 1875; 45 x 0,75 = 33,75; 120 x 0,75 = 90; 680 x 0,75 = 510. Ademas `teclado.conDescuento(0.10)` devolvio 108 (120 x 0,90).

La clase es una sola plantilla: cada producto nuevo se crea con una linea (`new Producto(...)`) y ya trae sus metodos, sin repetir codigo.
Al agregar el monitor al arreglo aparecio en la pagina sin tocar el HTML, porque la lista se genera desde los objetos con createElement.

## Ejercicio 6: DOM, eventos y objetos juntos

```js
class Carrito {
  constructor() {
    this.items = [];
  }

  agregar(producto) {
    this.items.push(producto);
  }

  total() {
    let suma = 0;
    this.items.forEach((p) => {
      suma = suma + p.precio;
    });
    return suma;
  }
}

formProducto.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const producto = new Producto(prodNombre.value, Number(prodPrecio.value));
  carrito.agregar(producto);
  const li = document.createElement("li");
  li.textContent = producto.descripcion();
  listaCarrito.appendChild(li);
  total.textContent = carrito.total().toFixed(2);
  formProducto.reset();
});
```

| Prueba | Total que muestra la pagina | Correcto (Si/No) |
|---|---|---|
| Cuaderno 12.50 | S/ 12.50 | Si |
| + Lapicero 3.20 | S/ 15.70 | Si |
| + Mochila 89.90 | S/ 105.60 | Si |
| Sin Number() | S/ 0.00; el producto no aparece y la consola muestra `Uncaught TypeError: this.precio.toFixed is not a function` | No |

| Pieza | Linea de tu codigo donde aparece | Para que sirve |
|---|---|---|
| DOM | `const li = document.createElement("li"); listaCarrito.appendChild(li);` y `total.textContent = carrito.total().toFixed(2);` | Crear el elemento de la lista y actualizar el total en pantalla |
| Evento | `formProducto.addEventListener("submit", (evento) => { evento.preventDefault(); ... })` | Ejecutar el codigo cuando el usuario envia el formulario, sin recargar la pagina |
| Objeto | `const producto = new Producto(prodNombre.value, Number(prodPrecio.value)); carrito.agregar(producto);` | Guardar los datos del producto y acumularlos en el carrito para calcular el total |

Nota: la suma real en memoria es 105.60000000000001 (asi guarda la computadora los decimales); `toFixed(2)` la muestra como 105.60.
