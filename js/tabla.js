let elementos = [];

const cargarDatosDesdeBackend = async () => {
  try {
    const res = await fetch("./ws/getElement.php");
    const data = await res.json();
    if (data.success) {
      elementos = data.data;
      cargarTabla();
    } else {
      mostrarAlerta("Error", data.message);
    }
  } catch {
    mostrarAlerta("Error", "Error al cargar datos.");
  }
};

const cargarTabla = () => {
  const tbody = document.getElementById("contenidoTabla");
  tbody.innerHTML = "";
  elementos.forEach((elemento, index) => {
    const fila = document.createElement("tr");
    for (const key in elemento) {
      const celda = document.createElement("td");
      celda.textContent = elemento[key];
      fila.appendChild(celda);
    }
    const celdaAccion = document.createElement("td");
    const botonModificar = document.createElement("button");
    botonModificar.textContent = "Modificar";
    botonModificar.onclick = () => mostrarFormularioEdicion(index);
    celdaAccion.appendChild(botonModificar);

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.onclick = () => eliminarElemento(elemento.id);
    celdaAccion.appendChild(botonEliminar);

    fila.appendChild(celdaAccion);
    tbody.appendChild(fila);
  });
};

const mostrarFormularioEdicion = (index) => {
  const elemento = elementos[index];
  document.getElementById("idElemento").value = elemento.id;
  document.getElementById("nombre").value = elemento.nombre;
  document.getElementById("descripcion").value = elemento.descripcion;
  document.getElementById("numSerie").value = elemento.numSerie;
  document.getElementById("estado").value = elemento.estado;
  document.getElementById("prioridad").value = elemento.prioridad;
  document.getElementById("formularioEdicion").classList.remove("hidden");
};

const guardarCambiosElemento = async () => {
  const id = document.getElementById("idElemento").value;
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const numSerie = document.getElementById("numSerie").value;
  const estado = document.getElementById("estado").value;
  const prioridad = document.getElementById("prioridad").value;

  try {
    const res = await fetch(`./ws/modifyElement.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id, nombre, descripcion, numSerie, estado, prioridad }),
    });
    const data = await res.json();
    if (data.success) {
      mostrarAlerta("Éxito", data.message);
      document.getElementById("formularioEdicion").classList.add("hidden");
      cargarDatosDesdeBackend();
    } else {
      mostrarAlerta("Error", data.message);
    }
  } catch {
    mostrarAlerta("Error", "Error al guardar cambios.");
  }
};

const cancelarEdicion = () => {
  document.getElementById("formularioEdicion").classList.add("hidden");
};

const eliminarElemento = async (id) => {
  try {
    const res = await fetch(`./ws/deleteElement.php?id=${id}`, { method: "GET" });
    const data = await res.json();
    if (data.success) {
      mostrarAlerta("Éxito", data.message);
      cargarDatosDesdeBackend();
    } else {
      mostrarAlerta("Error", data.message);
    }
  } catch {
    mostrarAlerta("Error", "Error al eliminar el elemento.");
  }
};

const filtrarTabla = () => {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const filas = document.querySelectorAll("#contenidoTabla tr");
  filas.forEach((fila) => {
    const nombre = fila.cells[1]?.textContent?.toLowerCase();
    const descripcion = fila.cells[2]?.textContent?.toLowerCase();
    fila.style.display = nombre?.startsWith(filtro) || descripcion?.startsWith(filtro) ? "" : "none";
  });
};

const mostrarAlerta = (titulo, mensaje) => {
  alert(`${titulo}: ${mensaje}`);
};

cargarDatosDesdeBackend();
document.getElementById("filtro").addEventListener("input", filtrarTabla);
