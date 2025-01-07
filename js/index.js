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

document.getElementById('registroForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const capitalizarPrimeraLetra = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

  // Valores de los campos dentro del evento submit 
  const nombre = capitalizarPrimeraLetra(document.getElementById('nombre').value.trim());
  const descripcion = capitalizarPrimeraLetra(document.getElementById('descripcion').value.trim());
  const numSerie = document.getElementById('numSerie').value.trim();
  const estado = document.getElementById('activo').checked ? 'activo' : 'inactivo';  
  const prioridad = document.querySelector('input[name="prioridad"]:checked') ? document.querySelector('input[name="prioridad"]:checked').value : '';  // Obtener el valor de la prioridad seleccionada

  // Lista de campos faltantes
  const camposFaltantes = [];
  if (!nombre) camposFaltantes.push('Nombre');
  if (!descripcion) camposFaltantes.push('Descripción');
  if (!numSerie) camposFaltantes.push('Número de Serie');
  if (!estado) camposFaltantes.push('Estado');
  if (!prioridad) camposFaltantes.push('Prioridad');

  
  if (camposFaltantes.length > 0) {  
    mostrarAlerta('Error', `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}`, 'error');
    return;  
  }

 
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Confirma que deseas registrar este sensor.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, registrar',
  });

  if (confirmacion.isConfirmed) {
    const formData = new FormData(e.target);

    try {
      const response = await fetch('./createElement.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        Swal.fire('¡Éxito!', result.message, 'success');
      } else {
        if (result.data) {
          mostrarErroresValidacion(result.data);
        } else {
          Swal.fire('Error', result.message, 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al procesar la solicitud.', 'error');
      console.error('Error en la solicitud:', error);
    }
  }
});
