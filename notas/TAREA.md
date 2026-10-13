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

## Version 2: con eventos

**Que agregue:** un formulario (nombre y nota), un campo de busqueda y un boton **Borrar** en cada estudiante. Use tres tipos de eventos: `submit` para agregar, `input` para filtrar mientras se escribe y `click` en cada boton Borrar. Agregue tambien la validacion: el nombre no puede estar vacio y la nota debe ser un numero entre 0 y 20; el error se muestra en rojo dentro de la pagina (parrafo `#mensaje`), no con `alert`. Todo el dibujo paso a una funcion `dibujar()` que se vuelve a ejecutar despues de cada cambio.

**Por que:** la version 1 no reaccionaba al usuario. Con los eventos la lista se vuelve una herramienta real; y con `preventDefault()` el formulario no recarga la pagina (lo aprendido en el Ejercicio 4).

**Que cambio en la pagina:** ahora se pueden agregar estudiantes, buscarlos y borrarlos; el promedio y los aprobados se recalculan solos. Si la nota es 25, -1 o esta vacia aparece "La nota debe ser un numero entre 0 y 20." en rojo y no se agrega nada. Los datos siguen siendo objetos sueltos `{ nombre, nota }` y los calculos estan repetidos dentro de `dibujar()`.

```js
function dibujar() {
  lista.innerHTML = "";
  const texto = buscar.value.trim().toLowerCase();

  estudiantes
    .filter((e) => e.nombre.toLowerCase().includes(texto))
    .forEach((e) => {
      const li = document.createElement("li");
      const aprobado = e.nota >= NOTA_MINIMA;
      li.classList.add(aprobado ? "aprobado" : "desaprobado");

      const info = document.createElement("span");
      info.textContent = e.nombre + " - " + e.nota;
      const estado = document.createElement("span");
      estado.classList.add("estado");
      estado.textContent = aprobado ? "aprobado" : "desaprobado";
      info.appendChild(estado);

      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "Borrar";
      btnBorrar.classList.add("borrar");
      btnBorrar.addEventListener("click", () => {
        estudiantes = estudiantes.filter((x) => x !== e);
        mensaje.textContent = "Se elimino a " + e.nombre;
        mensaje.className = "ok";
        dibujar();
      });

      li.appendChild(info);
      li.appendChild(btnBorrar);
      lista.appendChild(li);
    });

  let suma = 0;
  let contAprobados = 0;
  estudiantes.forEach((e) => {
    suma = suma + e.nota;
    if (e.nota >= NOTA_MINIMA) {
      contAprobados = contAprobados + 1;
    }
  });
  promedio.textContent = estudiantes.length > 0 ? (suma / estudiantes.length).toFixed(2) : "0.00";
  aprobados.textContent = contAprobados;
  cantidad.textContent = estudiantes.length;
}

formEstudiante.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const valorNombre = nombre.value.trim();
  const valorNota = Number(nota.value);

  if (valorNombre === "") {
    mensaje.textContent = "Escribe el nombre del estudiante.";
    mensaje.className = "error";
    return;
  }
  if (nota.value === "" || isNaN(valorNota) || valorNota < 0 || valorNota > 20) {
    mensaje.textContent = "La nota debe ser un numero entre 0 y 20.";
    mensaje.className = "error";
    return;
  }

  estudiantes.push({ nombre: valorNombre, nota: valorNota });
  mensaje.textContent = "Se agrego a " + valorNombre;
  mensaje.className = "ok";
  formEstudiante.reset();
  dibujar();
});

buscar.addEventListener("input", dibujar);

dibujar();
```
