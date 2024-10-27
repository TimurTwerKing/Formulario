<?php

class ValidadorFormulario
{
    private $errores = [];

    // Método para validar el nombre
    public function validarNombre($nombre)
    {
        if (empty($nombre)) {
            $this->errores[] = 'El nombre es obligatorio.';
        }
    }

    // Método para validar la descripción
    public function validarDescripcion($descripcion)
    {
        if (empty($descripcion)) {
            $this->errores[] = 'La descripción es obligatoria.';
        }
    }

    // Método para validar el número de serie
    public function validarNumSerie($numSerie)
    {
        if (empty($numSerie)) {
            $this->errores[] = 'El número de serie es obligatorio.';
        }
    }

    // Método para validar la prioridad
    public function validarPrioridad($prioridad)
    {
        if (empty($prioridad)) {
            $this->errores[] = 'La prioridad es obligatoria.';
        }
    }

    // Método para obtener los errores
    public function obtenerErrores()
    {
        return $this->errores;
    }

    // Método para verificar si hay errores
    public function tieneErrores()
    {
        return !empty($this->errores);
    }
}