let elementos = [];

//Función para cargar los datos desde el archivo
const cargarDatosDesdeArchivo = async () => {
  const res = await fetch("./ws/fileSensor.txt");
  const data = await res.text();
  const lineas = data.trim().split("\n");
  elementos = lineas.map((linea) => JSON.parse(linea));
  cargarTabla();
};

// Función para cargar los datos en la tabla HTML
const cargarTabla = () => {
  const tbody = document.getElementById("contenidoTabla");
  tbody.innerHTML = "";

  // Iterar sobre el array 'elementos' y crear filas
  elementos.forEach((elemento, index) => {
    const fila = document.createElement("tr");

    // Iterar sobre las propiedades de cada objeto (elemento)
    for (const key in elemento) {
      const celda = document.createElement("td");
      celda.textContent = elemento[key];
      fila.appendChild(celda);
    }

    // Columna de acciones
    const celdaAccion = document.createElement("td"); //Crear celda
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "X";
    botonEliminar.onclick = () => eliminarFila(index);
    celdaAccion.appendChild(botonEliminar);
    fila.appendChild(celdaAccion);

    // Añadir la fila a la tabla
    tbody.appendChild(fila);
  });
};

// Función para eliminar una fila de la tabla y del array de elementos
const eliminarFila = (index) => {
  elementos.splice(index, 1); // Eliminar el elemento del array
  cargarTabla();
};

// Función para filtrar las filas de la tabla según el texto introducido en el campo de búsqueda
const filtrarTabla = () => {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const filas = document.querySelectorAll("#contenidoTabla tr");

  filas.forEach((fila) => {
    const nombre = fila.cells[0].textContent.toLowerCase();
    const descripcion = fila.cells[1].textContent.toLowerCase();

    if (
      filtro.length < 3 ||
      nombre.startsWith(filtro) ||
      descripcion.startsWith(filtro)
    ) {
      fila.style.display = ""; // Mostrar fila
    } else {
      fila.style.display = "none"; // Ocultar fila
    }
  });
};

// Añadir un evento al input de búsqueda para filtrar la tabla
document.getElementById("filtro").addEventListener("input", filtrarTabla);

// Al cargar la página, ejecutamos la función cargarDatosDesdeArchivo() para cargar los datos
window.onload = cargarDatosDesdeArchivo();

// const cargarDatosDesdeArchivo = () => {
//   fetch("./ws/fileSensor.txt")
//     .then((response) => response.text())
//     .then((data) => {
//       const lineas = data.trim().split("\n");
//       elementos = lineas.map((linea) => JSON.parse(linea));
//       cargarTabla();
//     });
// };

// const cargarDatosDesdeArchivo = () => {
//   fetch("./ws/fileSensor.txt")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Error al cargar el archivo");
//       }
//       return response.text();
//     })
//     .then((data) => {
//       // Separamos cada línea en un array y luego convertimos cada línea en un objeto
//       const lineas = data.trim().split("\n");
//       elementos = lineas.map((linea) => JSON.parse(linea));
//       cargarTabla(); // Cargamos la tabla después de cargar los datos
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert("No se pudieron cargar los datos.");
//     });
// };
