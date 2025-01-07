let elementos = [];

const mostrarAlerta = (titulo, mensaje, tipo = 'info') => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: tipo,
  });
};

const mostrarErroresValidacion = (errores) => {
  let mensaje = 'Errores en los datos enviados:';
  errores.forEach(error => {
    mensaje += `\n- ${error}`;
  });
  mostrarAlerta('Error', mensaje, 'error');
};

const confirmarAccion = async (titulo, texto) => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
  });
  return result.isConfirmed;
};

const cargarDatosDesdeBackend = async () => {
  try {
    const res = await fetch("./ws/getElement.php");
    if (!res.ok) throw new Error(`Error de servidor: ${res.status}`);
    const data = await res.json();
    if (data.success) {
      elementos = data.data;
      cargarTabla();
    } else {
      mostrarAlerta("Error", data.message || "Error desconocido al cargar los datos.", 'error');
    }
  } catch (error) {
    mostrarAlerta("Error", `No se pudo conectar con el servidor: ${error.message}`, 'error');
  }
};

const cargarTabla = () => {
  const tbody = document.getElementById("contenidoTabla");
  tbody.innerHTML = "";

  elementos.forEach((elemento, index) => {
    const fila = document.createElement("tr");
    fila.className = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';

    const propiedades = ['id', 'nombre', 'descripcion', 'numSerie', 'estado', 'prioridad'];
    propiedades.forEach(prop => {
      const celda = document.createElement("td");
      celda.className = "border px-4 py-2";
      celda.textContent = elemento[prop];
      fila.appendChild(celda);
    });

    const celdaAccion = document.createElement("td");
    celdaAccion.className = "border px-4 py-2";

    const botonModificar = document.createElement("button");
    botonModificar.textContent = "Modificar";
    botonModificar.className = "bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600";
    botonModificar.onclick = () => mostrarFormularioEdicion(index);

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600";
    botonEliminar.onclick = () => eliminarElemento(elemento.id);

    celdaAccion.appendChild(botonModificar);
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
  document.getElementById("formularioEdicion").scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const guardarCambiosElemento = async () => {
  if (!(await confirmarAccion('¿Guardar cambios?', '¿Estás seguro de que deseas guardar los cambios?'))) return;

  const id = document.getElementById("idElemento").value;
  const capitalizarPrimeraLetra = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

  const nombre = capitalizarPrimeraLetra(document.getElementById('nombre').value.trim());
  const descripcion = capitalizarPrimeraLetra(document.getElementById('descripcion').value.trim());
  const numSerie = document.getElementById('numSerie').value.trim();
  const estado = document.getElementById('estado').value;
  const prioridad = document.getElementById('prioridad').value;

  const camposRequeridos = ['nombre', 'descripcion', 'numSerie', 'estado', 'prioridad'];
  let camposFaltantes = [];

  camposRequeridos.forEach(campo => {
    if (!document.getElementById(campo).value) {
      camposFaltantes.push(campo);
    }
  });

  if (camposFaltantes.length > 0) {
    mostrarAlerta('Error', `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}`, 'error');
    return;
  }

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('descripcion', descripcion);
  formData.append('numSerie', numSerie);
  formData.append('estado', estado);
  formData.append('prioridad', prioridad);

  try {
    const res = await fetch(`./ws/modifyElement.php?id=${id}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`Error de servidor: ${res.status}`);
    const data = await res.json();
    if (data.success) {
      mostrarAlerta("Éxito", data.message || "Cambios guardados correctamente.", 'success');
      document.getElementById("formularioEdicion").classList.add("hidden");
      cargarDatosDesdeBackend();
    } else {
      if (data.data) {
        mostrarErroresValidacion(data.data);
      } else {
        mostrarAlerta("Error", data.message || "No se pudo guardar los cambios.", 'error');
      }
    }
  } catch (error) {
    mostrarAlerta("Error", `No se pudo conectar con el servidor: ${error.message}`, 'error');
  }
};

const cancelarEdicion = () => {
  document.getElementById("formularioEdicion").classList.add("hidden");
};

const eliminarElemento = async (id) => {
  if (!(await confirmarAccion('¿Eliminar elemento?', '¿Estás seguro de que deseas eliminar este elemento?'))) return;
  try {
    const res = await fetch(`./ws/deleteElement.php?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error de servidor: ${res.status}`);
    const data = await res.json();
    if (data.success) {
      mostrarAlerta("Éxito", data.message || "Elemento eliminado correctamente.", 'success');
      cargarDatosDesdeBackend();
    } else {
      mostrarAlerta("Error", data.message || "No se pudo eliminar el elemento.", 'error');
    }
  } catch (error) {
    mostrarAlerta("Error", `No se pudo conectar con el servidor: ${error.message}`, 'error');
  }
};

const filtrarTabla = () => {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const filas = document.querySelectorAll("#contenidoTabla tr");

  filas.forEach((fila) => {
    const nombre = fila.cells[1]?.textContent?.toLowerCase() || '';
    const descripcion = fila.cells[2]?.textContent?.toLowerCase() || '';
    fila.style.display = nombre.includes(filtro) || descripcion.includes(filtro) ? "" : "none";
  });
};

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosDesdeBackend();
  document.getElementById("filtro").addEventListener("input", filtrarTabla);
});
