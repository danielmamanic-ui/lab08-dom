// Tarea Lab 08 - Version 2: DOM + eventos
// El usuario ya puede agregar, buscar y borrar estudiantes.
// Los datos todavia son objetos sueltos ({ nombre, nota }) y los calculos estan en funciones.
console.log("tarea v2 cargada");

const NOTA_MINIMA = 11;

let estudiantes = [
  { nombre: "Ana Torres", nota: 16 },
  { nombre: "Luis Quispe", nota: 9 },
  { nombre: "Rosa Huaman", nota: 13 }
];

const formEstudiante = document.querySelector("#formEstudiante");
const nombre = document.querySelector("#nombre");
const nota = document.querySelector("#nota");
const mensaje = document.querySelector("#mensaje");
const buscar = document.querySelector("#buscar");
const lista = document.querySelector("#lista");
const promedio = document.querySelector("#promedio");
const aprobados = document.querySelector("#aprobados");
const cantidad = document.querySelector("#cantidad");

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
