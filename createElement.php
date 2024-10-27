<?php
// Incluir archivos de dependencias y clases necesarias
require_once './ws/interfaces/ToJson.php';
require_once './ws/models/Element.php';
require_once './ValidadorFormulario.php';

// Recoger datos del formulario usando el operador de coalescencia nula
$nombre = $_POST['nombre'] ?? null;
$descripcion = $_POST['descripcion'] ?? null;
$numSerie = $_POST['numSerie'] ?? null;
$estado = isset($_POST['estado']) ? 'activo' : 'inactivo'; // Checkbox
$prioridad = $_POST['prioridad'] ?? null; // Radio button

// Crear instancia del validador y validar los campos
$validador = new ValidadorFormulario();
$validador->validarNombre($nombre);
$validador->validarDescripcion($descripcion);
$validador->validarNumSerie($numSerie);
$validador->validarPrioridad($prioridad);

// Verificar si hay errores de validación
if (!$validador->tieneErrores()) {
    // Crear una instancia de Element y convertir el objeto a JSON
    $sensor = new Element($nombre, $descripcion, $numSerie, $estado, $prioridad);
    $data = $sensor->toJson() . PHP_EOL;

    // Especificar el archivo donde se guardarán los datos
    $file = './ws/fileSensor.txt';

    // Guardar los datos en el archivo sin sobrescribir (añadir al final)
    if (file_put_contents($file, $data, FILE_APPEND)) {
        // Respuesta para confirmar que los datos se guardaron correctamente
        echo "Datos guardados correctamente: " . $sensor->toJson();
    } else {
        echo 'Error al guardar los datos en el archivo. Verifica los permisos.';
    }
} else {
    // Mostrar errores de validación en caso de que existan
    echo implode('<br>', $validador->obtenerErrores());
}
