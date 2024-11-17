<?php
require_once './ws/interfaces/ToJson.php';

class Element implements ToJson
{
    private $nombre;
    private $descripcion;
    private $numSerie;
    private $estado;
    private $prioridad;

    public function __construct($nombre, $descripcion, $numSerie, $estado, $prioridad)
    {
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->numSerie = $numSerie;
        $this->estado = $estado;
        $this->prioridad = $prioridad;
    }

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
