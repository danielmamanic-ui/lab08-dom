// Tarea Lab 08 - Version 1: solo DOM
// Los datos son fijos y la pagina solo los dibuja con createElement.
console.log("tarea v1 cargada");

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
