<?php

class ValidadorFormulario
{
    private $errores = [];

    public function validarNombre($nombre)
    {
        if (empty($nombre)) {
            $this->errores[] = 'El nombre es obligatorio.';
        }
    }

    public function validarDescripcion($descripcion)
    {
        if (empty($descripcion)) {
            $this->errores[] = 'La descripción es obligatoria.';
        }
    }

    public function validarNumSerie($numSerie)
    {
        if (empty($numSerie)) {
            $this->errores[] = 'El número de serie es obligatorio.';
        }
    }

    public function validarPrioridad($prioridad)
    {
        if (empty($prioridad)) {
            $this->errores[] = 'La prioridad es obligatoria.';
        }
    }

    public function obtenerErrores()
    {
        return $this->errores;
    }

    public function tieneErrores()
    {
        return !empty($this->errores);
    }
}