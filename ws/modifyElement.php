<?php
require_once '../db/Conexion.php';
require_once '../db/Response.php';
require_once './models/Element.php';

$elemento = new Element();
$elemento->modifyElement();
