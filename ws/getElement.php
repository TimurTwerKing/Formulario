<?php
require_once '../db/Conexion.php';
require_once '../db/Response.php';

$conexion = new Conexion();
$db = $conexion->obtenerConexion();

if (isset($_GET['id'])) {
    // Si recibimos un ID, buscamos un único elemento
    $id = $_GET['id'];
    $stmt = $db->prepare("SELECT * FROM elementos WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    $elemento = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($elemento) {
        // Si encontramos el elemento, devolverlo
        $response = new Response(true, 'Elemento encontrado.', $elemento);
    } else {
        // Si no encontramos el elemento con el ID proporcionado
        $response = new Response(false, 'Elemento no encontrado.');
    }
} else {
    // Si no se pasa ningún ID, obtenemos todos los elementos
    $stmt = $db->prepare("SELECT * FROM elementos");
    $stmt->execute();

    $elementos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($elementos) {
        // Si hay elementos, devolverlos
        $response = new Response(true, 'Elementos encontrados.', $elementos);
    } else {
        // Si no hay elementos en la base de datos
        $response = new Response(false, 'No se encontraron elementos.');
    }
}

echo $response->toJson();

