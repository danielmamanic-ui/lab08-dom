// Tarea Lab 08 - Version 3: DOM + eventos + clases y objetos
// Cada estudiante es un objeto de la clase Estudiante y el grupo es un objeto RegistroNotas.
console.log("tarea v3 cargada");

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

// Elementos del DOM
const formEstudiante = document.querySelector("#formEstudiante");
const nombre = document.querySelector("#nombre");
const nota = document.querySelector("#nota");
const mensaje = document.querySelector("#mensaje");
const buscar = document.querySelector("#buscar");
const lista = document.querySelector("#lista");
const promedio = document.querySelector("#promedio");
const aprobados = document.querySelector("#aprobados");
const cantidad = document.querySelector("#cantidad");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function dibujar() {
  lista.innerHTML = "";

  registro.buscar(buscar.value).forEach((est) => {
    const li = document.createElement("li");
    li.classList.add(est.estado());

    const info = document.createElement("span");
    info.textContent = est.descripcion();
    const estado = document.createElement("span");
    estado.classList.add("estado");
    estado.textContent = est.estado();
    info.appendChild(estado);

    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Borrar";
    btnBorrar.classList.add("borrar");
    btnBorrar.addEventListener("click", () => {
      registro.eliminar(est);
      mostrarMensaje("Se elimino a " + est.nombre, "ok");
      dibujar();
    });

    li.appendChild(info);
    li.appendChild(btnBorrar);
    lista.appendChild(li);
  });

  promedio.textContent = registro.promedio().toFixed(2);
  aprobados.textContent = registro.cantidadAprobados();
  cantidad.textContent = registro.estudiantes.length;
}

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
