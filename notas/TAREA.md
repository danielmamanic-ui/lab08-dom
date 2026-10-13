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

## Version 3: con clases y objetos

**Que agregue:** dos clases propias. `Estudiante` (atributos `nombre` y `nota`; metodos `estaAprobado()`, `estado()` y `descripcion()`) y `RegistroNotas` (atributo `estudiantes`; metodos `agregar()`, `eliminar()`, `buscar()`, `promedio()` y `cantidadAprobados()`). El evento `submit` ahora crea un objeto con `new Estudiante(...)` y lo guarda con `registro.agregar(...)`; el boton Borrar llama a `registro.eliminar(est)`.

**Por que:** en la version 2 la regla de aprobado (`nota >= 11`) y la suma del promedio estaban mezcladas con el codigo del DOM. Al pasarlas a clases, cada objeto sabe calcular lo suyo y `dibujar()` solo se encarga de mostrar.

**Que cambio en la pagina:** para el usuario se ve y funciona igual que la version 2 (esa era la idea: reorganizar sin romper). La diferencia esta en el codigo: es mas corto dentro de los eventos y mas facil de ampliar (por ejemplo, cambiar la nota minima en un solo lugar: `Estudiante.NOTA_MINIMA`).

```js
class Estudiante {
  constructor(nombre, nota) {
    this.nombre = nombre;
    this.nota = nota;
  }

  estaAprobado() {
    return this.nota >= Estudiante.NOTA_MINIMA;
  }

  estado() {
    return this.estaAprobado() ? "aprobado" : "desaprobado";
  }

  descripcion() {
    return this.nombre + " - " + this.nota;
  }
}
Estudiante.NOTA_MINIMA = 11;

class RegistroNotas {
  constructor() {
    this.estudiantes = [];
  }

  agregar(estudiante) {
    this.estudiantes.push(estudiante);
  }

  eliminar(estudiante) {
    this.estudiantes = this.estudiantes.filter((e) => e !== estudiante);
  }

  buscar(texto) {
    const t = texto.trim().toLowerCase();
    return this.estudiantes.filter((e) => e.nombre.toLowerCase().includes(t));
  }

  promedio() {
    if (this.estudiantes.length === 0) {
      return 0;
    }
    let suma = 0;
    this.estudiantes.forEach((e) => {
      suma = suma + e.nota;
    });
    return suma / this.estudiantes.length;
  }

  cantidadAprobados() {
    return this.estudiantes.filter((e) => e.estaAprobado()).length;
  }
}

// Datos iniciales
const registro = new RegistroNotas();
registro.agregar(new Estudiante("Ana Torres", 16));
registro.agregar(new Estudiante("Luis Quispe", 9));
registro.agregar(new Estudiante("Rosa Huaman", 13));
```

```js
// Evento submit: validar y crear un objeto Estudiante
formEstudiante.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const valorNombre = nombre.value.trim();
  const valorNota = Number(nota.value);

  if (valorNombre === "") {
    mostrarMensaje("Escribe el nombre del estudiante.", "error");
    return;
  }
  if (nota.value === "" || isNaN(valorNota) || valorNota < 0 || valorNota > 20) {
    mostrarMensaje("La nota debe ser un numero entre 0 y 20.", "error");
    return;
  }

  registro.agregar(new Estudiante(valorNombre, valorNota));
  mostrarMensaje("Se agrego a " + valorNombre, "ok");
  formEstudiante.reset();
  dibujar();
});

// Evento input: filtrar la lista mientras se escribe
buscar.addEventListener("input", dibujar);

dibujar();
```

## Donde uso DOM, eventos y objetos

| Parte | Codigo de la version final (tarea/app.js) | Para que sirve |
|---|---|---|
| DOM | `document.querySelector("#lista")`, `document.createElement("li")`, `classList.add(est.estado())`, `lista.appendChild(li)`, `promedio.textContent = registro.promedio().toFixed(2)` | Encontrar los elementos, crear cada fila de la lista y mostrar el promedio y los aprobados |
| Eventos | `formEstudiante.addEventListener("submit", ...)`, `buscar.addEventListener("input", dibujar)`, `btnBorrar.addEventListener("click", ...)` | Agregar con validacion, filtrar mientras se escribe y borrar un estudiante |
| Objetos | `class Estudiante`, `class RegistroNotas`, `new Estudiante(valorNombre, valorNota)`, `registro.agregar(...)`, `registro.eliminar(est)`, `registro.promedio()` | Guardar los datos de cada estudiante y del grupo, y hacer los calculos |

## Pruebas realizadas

Datos iniciales: Ana Torres 16, Luis Quispe 9, Rosa Huaman 13 (promedio 12.67, 2 aprobados de 3).

| N | Accion | Resultado esperado | Resultado obtenido | Cumple |
|---|---|---|---|---|
| 1 | Agregar con el nombre vacio y nota 15 | Mensaje de error en rojo; no se agrega | "Escribe el nombre del estudiante." en rojo; la lista sigue con 3 | Si |
| 2 | Agregar "Pedro Diaz" con nota 25 | Mensaje de error en rojo; no se agrega | "La nota debe ser un numero entre 0 y 20." en rojo; la lista sigue con 3 | Si |
| 3 | Agregar "Pedro Diaz" con nota -1 | Mensaje de error en rojo; no se agrega | El mismo mensaje de error; la lista sigue con 3 | Si |
| 4 | Agregar "Pedro Diaz" con la nota vacia | Mensaje de error en rojo; no se agrega | El mismo mensaje de error; la lista sigue con 3 | Si |
| 5 | Agregar "Carlos Rojas" con nota 18 | Aparece en verde; promedio (16+9+13+18)/4 = 14.00; 3 de 4 aprobados | "Se agrego a Carlos Rojas"; promedio 14.00; aprobados 3 de 4 | Si |
| 6 | Agregar "Pedro Diaz" con nota 10.5 | Aparece en rojo como desaprobado (10.5 < 11); promedio 66.5/5 = 13.30 | Pedro Diaz - 10.5 desaprobado; promedio 13.30; aprobados 3 de 5 | Si |
| 7 | Escribir "ro" en el buscador | Solo quedan los nombres que contienen "ro": Rosa, Carlos Rojas y Pedro | Se muestran Rosa Huaman, Carlos Rojas y Pedro Diaz | Si |
| 8 | Clic en Borrar de Luis Quispe | Desaparece de la lista; promedio 57.5/4 = 14.38 | "Se elimino a Luis Quispe"; promedio 14.38; aprobados 3 de 4 | Si |
| 9 | Borrar a todos los estudiantes | Lista vacia y promedio 0.00 sin errores | Lista vacia; promedio 0.00; 0 de 0; la consola no muestra errores | Si |

## Por que disene asi mi clase

Disene `Estudiante` con solo dos atributos, `nombre` y `nota`, porque son los unicos datos que el docente escribe; todo lo demas se puede calcular a partir de ellos. Por eso el estado no se guarda como atributo sino que se obtiene con el metodo `estaAprobado()`: si la nota cambia o cambia la nota minima, el resultado siempre es correcto. Los metodos `estado()` y `descripcion()` devuelven el texto que necesita la pagina, asi el codigo del DOM no repite la regla de aprobado. Agregue una segunda clase, `RegistroNotas`, porque el promedio, la busqueda y los aprobados no pertenecen a un estudiante sino al grupo completo; es la misma idea que `Carrito` en el Ejercicio 6, que guarda varios `Producto`.
