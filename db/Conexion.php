<?php
class Conexion
{
    private $host = 'localhost';
    private $user = 'root';
    private $pass = '';
    private $nameBD = 'monfab';
    private $conn;

    public function __construct()
    {
        try {
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->nameBD};charset=utf8mb4", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Error de conexión: " . $e->getMessage() . "En " . $e->getTraceAsString(),
                "data" => null
            ]);
            exit;
        }
    }

    public function obtenerConexion()
    {
        return $this->conn;
    }

   
}