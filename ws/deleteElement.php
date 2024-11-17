<?php
require_once '../db/Conexion.php';
require_once '../db/Response.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $conexion = new Conexion();
    $db = $conexion->obtenerConexion();

    $stmt = $db->prepare("SELECT * FROM elementos WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    $elemento = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($elemento) {
        // Si el elemento existe, lo eliminamos
        $stmt = $db->prepare("DELETE FROM elementos WHERE id = :id");
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            $response = new Response(true, 'Elemento eliminado correctamente.', $elemento);
        } else {
            $response = new Response(false, 'Error al eliminar el elemento.');
        }
    } else {
        $response = new Response(false, 'Elemento no encontrado.');
    }
} else {
    $response = new Response(false, 'ID no proporcionado.');
}

echo $response->toJson();

