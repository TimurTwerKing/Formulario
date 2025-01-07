<?php
require_once './interfaces/ToJson.php';
require_once '../db/Conexion.php';
require_once '../db/Response.php';

class Element implements ToJson
{
    private $nombre;
    private $descripcion;
    private $numSerie;
    private $estado;
    private $prioridad;

    public function __construct($nombre = null, $descripcion = null, $numSerie = null, $estado = null, $prioridad = null)
    {
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->numSerie = $numSerie;
        $this->estado = $estado;
        $this->prioridad = $prioridad;
    }

    private function cnn()
    {
        return (new Conexion())->obtenerConexion();
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

    private function getArguments($data)
    {
        return [
            'nombre' => $data['nombre'] ?? null,
            'descripcion' => $data['descripcion'] ?? null,
            'numSerie' => $data['numSerie'] ?? null,
            'estado' => $data['estado'] ?? 'inactivo',
            'prioridad' => $data['prioridad'] ?? null,
        ];
    }

    private function respond($success, $message, $data = null)
    {
        echo (new Response($success, $message, $data))->toJson();
    }

    private function findElementById($id, $throwIfNotFound = false)
    {
        $stmt = $this->cnn()->prepare("SELECT * FROM elementos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $elemento = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($throwIfNotFound && !$elemento) {
            $this->respond(false, 'Elemento no encontrado.');
            exit;
        }

        return $elemento;
    }

    public function createElement()
    {
        $args = $this->getArguments($_POST);
        $db = $this->cnn();

        try {
            $stmt = $db->prepare("INSERT INTO elementos (nombre, descripcion, numSerie, estado, prioridad) 
                                   VALUES (:nombre, :descripcion, :numSerie, :estado, :prioridad)");
            $stmt->execute($args);

            $id = $db->lastInsertId();
            $this->respond(true, 'Elemento creado exitosamente.', array_merge(['id' => $id], $args));
        } catch (Exception $e) {
            $this->respond(false, 'Error al crear el elemento: ' . $e->getMessage());
        }
    }

    public function deleteElement()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->respond(false, 'ID no proporcionado.');
            return;
        }

        $elemento = $this->findElementById($id, true); // Arroja error si no existe.

        $stmt = $this->cnn()->prepare("DELETE FROM elementos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $this->respond(true, 'Elemento eliminado correctamente.', $elemento);
    }

    public function getElement()
    {
        $id = $_GET['id'] ?? null;

        if ($id) {
            $elemento = $this->findElementById($id, true); // Arroja error si no existe.
            $this->respond(true, 'Elemento encontrado.', $elemento);
        } else {
            $stmt = $this->cnn()->prepare("SELECT * FROM elementos");
            $stmt->execute();
            $elementos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->respond(
                $elementos ? true : false,
                $elementos ? 'Elementos encontrados.' : 'No se encontraron elementos.',
                $elementos
            );
        }
    }

    public function modifyElement()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->respond(false, 'ID no proporcionado.');
            return;
        }

        $elemento = $this->findElementById($id, true); // Arroja error si no existe.

        $args = $this->getArguments($_POST);
        $args['id'] = $id;

        // Importar y utilizar el validador
        require_once '../ValidadorFormulario.php';
        $validador = new ValidadorFormulario();

        function capitalizarPrimeraLetra($texto)
        {
            return ucfirst(strtolower($texto));
        }

        // Capitalizar primeras letras y validar campos
        if (!empty($args['nombre'])) {
            $args['nombre'] = capitalizarPrimeraLetra($args['nombre']);
            $validador->validarNombre($args['nombre']);
        }
        if (!empty($args['descripcion'])) {
            $args['descripcion'] = capitalizarPrimeraLetra($args['descripcion']);
            $validador->validarDescripcion($args['descripcion']);
        }
        if (!empty($args['numSerie'])) {
            $validador->validarNumSerie($args['numSerie']);
        }
        if (!empty($args['prioridad'])) {
            $validador->validarPrioridad($args['prioridad']);
        }

        if ($validador->tieneErrores()) {
            $this->respond(false, 'Errores en los datos enviados.', $validador->obtenerErrores());
            return;
        }

        $sql = "UPDATE elementos SET 
                nombre = COALESCE(:nombre, nombre), 
                descripcion = COALESCE(:descripcion, descripcion), 
                numSerie = COALESCE(:numSerie, numSerie),
                estado = COALESCE(:estado, estado),
                prioridad = COALESCE(:prioridad, prioridad)
            WHERE id = :id";

        $stmt = $this->cnn()->prepare($sql);

        if ($stmt->execute($args)) {
            $this->respond(true, 'Elemento actualizado correctamente.', array_merge($elemento, $args));
        } else {
            $this->respond(false, 'Error al actualizar el elemento.');
        }
    }


}
