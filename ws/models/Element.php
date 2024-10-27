<?php
// namespace Models;
require_once './ws/interfaces/ToJson.php';
// use interfaces\ToJson;

class Element implements ToJson
{
    private $nombre;
    private $descripcion;
    private $numSerie;
    private $estado;
    private $prioridad;

    // Constructor
    public function __construct($nombre, $descripcion, $numSerie, $estado, $prioridad)
    {
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->numSerie = $numSerie;
        $this->estado = $estado;
        $this->prioridad = $prioridad;
    }

    // Getters
    public function getNombre()
    {
        return $this->nombre;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getNumSerie()
    {
        return $this->numSerie;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getPrioridad()
    {
        return $this->prioridad;
    }

    // Setters
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function setNumSerie($numSerie)
    {
        $this->numSerie = $numSerie;
    }

    public function setEstado($estado)
    {
        $this->estado = $estado;
    }

    public function setPrioridad($prioridad)
    {
        $this->prioridad = $prioridad;
    }

    // Implementación del método toJson
    public function toJson(): string
    {
        return json_encode([
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'numSerie' => $this->numSerie,
            'estado' => $this->estado,
            'prioridad' => $this->prioridad
        ]);
    }
}
