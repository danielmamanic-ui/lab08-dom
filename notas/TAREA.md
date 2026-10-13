# Tarea: Mi componente interactivo

## Componente elegido

**Registro de notas de estudiantes.** Permite registrar el nombre y la nota de cada estudiante en escala vigesimal (0 a 20), muestra si esta aprobado o desaprobado (nota minima 11), calcula el promedio del grupo y la cantidad de aprobados, permite buscar por nombre y borrar estudiantes.

- Pagina publicada: [https://danielmamanic-ui.github.io/lab08-dom/tarea/](https://danielmamanic-ui.github.io/lab08-dom/tarea/)
- Codigo: [tarea/index.html](../tarea/index.html) y [tarea/app.js](../tarea/app.js)

## Version 1: solo DOM

**Que agregue:** la estructura HTML (titulo, lista y resumen) y un app.js que toma un arreglo fijo de tres estudiantes, crea un `<li>` por cada uno con `createElement`, le agrega la clase `aprobado` o `desaprobado` con `classList.add` y escribe el promedio y los aprobados con `textContent`.

**Por que:** primero queria comprobar que sabia seleccionar elementos y dibujar los datos en la pagina, sin mezclar todavia eventos ni clases.

**Que cambio en la pagina:** la lista aparece llena al abrir la pagina (Ana Torres 16, Luis Quispe 9, Rosa Huaman 13) con un borde verde o rojo, y el resumen muestra promedio 12.67 y 2 aprobados de 3. Pero la pagina es fija: el usuario no puede agregar ni borrar nada.

```js
const NOTA_MINIMA = 11;

const estudiantes = [
  { nombre: "Ana Torres", nota: 16 },
  { nombre: "Luis Quispe", nota: 9 },
  { nombre: "Rosa Huaman", nota: 13 }
];

const lista = document.querySelector("#lista");
const promedio = document.querySelector("#promedio");
const aprobados = document.querySelector("#aprobados");
const cantidad = document.querySelector("#cantidad");

let suma = 0;
let contAprobados = 0;

estudiantes.forEach((e) => {
  const li = document.createElement("li");
  const aprobado = e.nota >= NOTA_MINIMA;
  li.textContent = e.nombre + " - " + e.nota + (aprobado ? " (aprobado)" : " (desaprobado)");
  li.classList.add(aprobado ? "aprobado" : "desaprobado");
  lista.appendChild(li);

  suma = suma + e.nota;
  if (aprobado) {
    contAprobados = contAprobados + 1;
  }
});

promedio.textContent = (suma / estudiantes.length).toFixed(2);
aprobados.textContent = contAprobados;
cantidad.textContent = estudiantes.length;
```
