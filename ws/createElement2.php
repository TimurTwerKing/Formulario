<?php
require_once '../db/Conexion.php';
require_once '../db/Response.php';

$nombre = $_POST['nombre'] ?? null;
$descripcion = $_POST['descripcion'] ?? null;
$numSerie = $_POST['numSerie'] ?? null;
$estado = $_POST['estado'] ?? null;
$prioridad = $_POST['prioridad'] ?? null;

$conexion = new Conexion();
$db = $conexion->obtenerConexion();

try {
    // Insertar nuevo elemento
    $stmt = $db->prepare("INSERT INTO elementos (nombre, descripcion, numSerie, estado, prioridad) 
                           VALUES (:nombre, :descripcion, :numSerie, :estado, :prioridad)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':numSerie', $numSerie);
    $stmt->bindParam(':estado', $estado);
    $stmt->bindParam(':prioridad', $prioridad);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        echo json_encode([
            "success" => true,
            "message" => "Elemento creado exitosamente",
            "data" => ["id" => $id]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error al crear el elemento",
            "data" => null
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage(),
        "data" => null
    ]);
}
