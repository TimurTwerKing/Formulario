let elementos = [];

// Función para cargar los datos desde el backend usando "getElement.php"
const cargarDatosDesdeBackend = async () => {
  try {
    const res = await fetch("./ws/getElement.php");
    const data = await res.json();

    if (data.success) {
      elementos = data.data; // Asignar elementos obtenidos
      cargarTabla();
    } else {
      alert("Error al cargar datos: " + data.message);
    }
  } catch (error) {
    console.error("Error al cargar datos desde el backend:", error);
  }
};

// Función para cargar los datos en la tabla HTML
const cargarTabla = () => {
  const tbody = document.getElementById("contenidoTabla");
  tbody.innerHTML = "";

  elementos.forEach((elemento, index) => {
    const fila = document.createElement("tr");

    // Crear celdas para cada propiedad del elemento
    for (const key in elemento) {
      const celda = document.createElement("td");
      celda.textContent = elemento[key];
      fila.appendChild(celda);
    }

    // Columna de acciones
    const celdaAccion = document.createElement("td");

    // Botón para modificar
    const botonModificar = document.createElement("button");
    botonModificar.textContent = "Modificar";
    botonModificar.onclick = () => modificarElemento(index);
    celdaAccion.appendChild(botonModificar);

    // Botón para eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.onclick = () => eliminarElemento(elemento.id);
    celdaAccion.appendChild(botonEliminar);

    fila.appendChild(celdaAccion);

    // Añadir la fila a la tabla
    tbody.appendChild(fila);
  });
};

// Función para eliminar un elemento usando "deleteElement.php"
const eliminarElemento = async (id) => {
  try {
    const res = await fetch(`./ws/deleteElement.php?id=${id}`, {
      method: "GET",
    });
    const data = await res.json();

    if (data.success) {
      alert(data.message);
      cargarDatosDesdeBackend(); // Recargar los datos
    } else {
      alert("Error al eliminar: " + data.message);
    }
  } catch (error) {
    console.error("Error al eliminar elemento:", error);
  }
};

// Función para modificar un elemento usando "modifyElement.php"
const modificarElemento = (index) => {
  const elemento = elementos[index];

  // Solicitar nuevos valores al usuario (puedes reemplazarlo con un formulario modal)
  const nuevoNombre = prompt("Modificar nombre:", elemento.nombre) || elemento.nombre;
  const nuevaDescripcion = prompt("Modificar descripción:", elemento.descripcion) || elemento.descripcion;

  // Modificar los datos del elemento en el backend
  fetch(`./ws/modifyElement.php?id=${elemento.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert(data.message);
        cargarDatosDesdeBackend(); // Recargar datos
      } else {
        alert("Error al modificar: " + data.message);
      }
    })
    .catch((error) => console.error("Error al modificar elemento:", error));
};

// Función para crear un nuevo elemento usando "createElement.php"
const crearElemento = () => {
  // Solicitar datos al usuario (puedes usar un formulario modal)
  const nombre = prompt("Nombre del elemento:");
  const descripcion = prompt("Descripción del elemento:");
  const numSerie = prompt("Número de serie del elemento:");
  const estado = confirm("¿El elemento está activo?") ? "activo" : "inactivo";
  const prioridad = prompt("Prioridad (alta, media, baja):");

  // Crear el elemento en el backend
  fetch("./ws/createElement.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      nombre,
      descripcion,
      numSerie,
      estado,
      prioridad,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert(data.message);
        cargarDatosDesdeBackend(); // Recargar datos
      } else {
        alert("Error al crear elemento: " + data.message);
      }
    })
    .catch((error) => console.error("Error al crear elemento:", error));
};

// Función para filtrar las filas de la tabla
const filtrarTabla = () => {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const filas = document.querySelectorAll("#contenidoTabla tr");

  filas.forEach((fila) => {
    const nombre = fila.cells[0]?.textContent?.toLowerCase();
    const descripcion = fila.cells[1]?.textContent?.toLowerCase();

    if (
      filtro.length < 3 ||
      nombre?.startsWith(filtro) ||
      descripcion?.startsWith(filtro)
    ) {
      fila.style.display = ""; // Mostrar fila
    } else {
      fila.style.display = "none"; // Ocultar fila
    }
  });
};

// Inicializar la carga de datos
cargarDatosDesdeBackend();


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