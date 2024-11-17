<?php
require_once '../db/Conexion.php';
require_once '../db/Response.php';

if (isset($_GET['id'])) {
    // Obtenemos el id del elemento a modificar
    $id = $_GET['id'];

    // Recogemos los nuevos datos enviados por POST
    $nombre = $_POST['nombre'] ?? null;
    $descripcion = $_POST['descripcion'] ?? null;
    $numSerie = $_POST['numSerie'] ?? null;
    $estado = isset($_POST['estado']) ? 'activo' : 'inactivo';
    $prioridad = $_POST['prioridad'] ?? null;

    $conexion = new Conexion();
    $db = $conexion->obtenerConexion();

    // Verificar si el elemento con ese id existe
    $stmt = $db->prepare("SELECT * FROM elementos WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    $elemento = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($elemento) {
        // Si el elemento existe, lo vamos a modificar
        // Actualizamos solo los campos que fueron enviados, los demás se mantienen
        $stmt = $db->prepare("
            UPDATE elementos 
            SET 
                nombre = COALESCE(:nombre, nombre), 
                descripcion = COALESCE(:descripcion, descripcion), 
                numSerie = COALESCE(:numSerie, numSerie),
                estado = COALESCE(:estado, estado),
                prioridad = COALESCE(:prioridad, prioridad)
            WHERE id = :id
        ");

        // Bindeamos los valores
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':numSerie', $numSerie);
        $stmt->bindParam(':estado', $estado);
        $stmt->bindParam(':prioridad', $prioridad);

        if ($stmt->execute()) {
            // Si la actualización es exitosa, devolver el elemento modificado
            $elementoModificado = [
                'id' => $id,
                'nombre' => $nombre ?? $elemento['nombre'],
                'descripcion' => $descripcion ?? $elemento['descripcion'],
                'numSerie' => $numSerie ?? $elemento['numSerie'],
                'estado' => $estado ?? $elemento['estado'],
                'prioridad' => $prioridad ?? $elemento['prioridad']
            ];

            $response = new Response(true, 'Elemento actualizado correctamente.', $elementoModificado);
        } else {
            // Si hay un error al actualizar
            $response = new Response(false, 'Error al actualizar el elemento.');
        }
    } else {
        // Si no existe el elemento con ese id
        $response = new Response(false, 'Elemento no encontrado.');
    }
} else {
    // Si no se proporciona el id
    $response = new Response(false, 'ID no proporcionado.');
}

echo $response->toJson();

