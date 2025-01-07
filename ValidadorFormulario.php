<?php

class ValidadorFormulario
{
    private $errores = [];

    public function validarNombre($nombre)
    {
        if (empty($nombre)) {
            $this->errores[] = 'El nombre es obligatorio.';
        } elseif (strlen($nombre) < 3) {
            $this->errores[] = 'El nombre debe tener al menos 3 caracteres.';
        }
    }

    public function validarDescripcion($descripcion)
    {
        if (empty($descripcion)) {
            $this->errores[] = 'La descripción es obligatoria.';
        } elseif (strlen($descripcion) < 10) {
            $this->errores[] = 'La descripción debe tener al menos 10 caracteres.';
        }
    }

    public function validarNumSerie($numSerie)
    {
        if (empty($numSerie)) {
            $this->errores[] = 'El número de serie es obligatorio.';
        } elseif (!ctype_digit($numSerie) || intval($numSerie) <= 0) {
            $this->errores[] = 'El número de serie debe ser un número entero positivo.';
        }
    }

    public function validarPrioridad($prioridad)
    {
        if (empty($prioridad)) {
            $this->errores[] = 'La prioridad es obligatoria.';
        } elseif (!in_array($prioridad, ['baja', 'media', 'alta'])) {
            $this->errores[] = 'La prioridad debe ser baja, media o alta.';
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

