<?php
require_once './db/Conexion.php';
require_once './db/Response.php';
require_once './ValidadorFormulario.php';

$nombre = $_POST['nombre'] ?? null;
$descripcion = $_POST['descripcion'] ?? null;
$numSerie = $_POST['numSerie'] ?? null;
$estado = isset($_POST['estado']) ? 'activo' : 'inactivo';
$prioridad = $_POST['prioridad'] ?? null;

function capitalizarPrimeraLetra($texto) {
    return ucfirst(strtolower($texto));
}

// Capitalizar primeras letras
$nombre = capitalizarPrimeraLetra($nombre);
$descripcion = capitalizarPrimeraLetra($descripcion);

$validador = new ValidadorFormulario();
$validador->validarNombre($nombre);
$validador->validarDescripcion($descripcion);
$validador->validarNumSerie($numSerie);
$validador->validarPrioridad($prioridad);

if (!$validador->tieneErrores()) {
    try {
        $conexion = new Conexion();
        $db = $conexion->obtenerConexion();

        $stmt = $db->prepare("INSERT INTO elementos (nombre, descripcion, numSerie, estado, prioridad) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $nombre);
        $stmt->bindParam(2, $descripcion);
        $stmt->bindParam(3, $numSerie);
        $stmt->bindParam(4, $estado);
        $stmt->bindParam(5, $prioridad);

        if ($stmt->execute()) {
            $response = new Response(true, 'Elemento creado correctamente.', [
                'nombre' => $nombre,
                'descripcion' => $descripcion,
                'numSerie' => $numSerie,
                'estado' => $estado,
                'prioridad' => $prioridad
            ]);
        } else {
            $response = new Response(false, 'Error al guardar los datos.');
        }
    } catch (Exception $e) {
        $response = new Response(false, 'Error en la base de datos: ' . $e->getMessage());
    }
} else {
    $response = new Response(false, 'Errores en los datos enviados.', $validador->obtenerErrores());
}

echo $response->toJson();
?>
