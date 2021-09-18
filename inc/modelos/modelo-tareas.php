<?php
$accion = $_POST['accion'] ;

if (isset($_POST['id_proyecto']) ){
    $id_proyecto = (int)$_POST['id_proyecto'] ;
}
if (isset($_POST['tarea'])){
    $tarea = $_POST['tarea'] ;
}

if (isset($_POST['estado'])){
    $estado = $_POST['estado'];
}

if (isset($_POST['id'])){
    $id_tarea = (int)$_POST['id'];
}


if($accion === 'crear') {
    // importar la conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre,id_proyecto) VALUES (?,?) ");
        $stmt->bind_param('si',$tarea, $id_proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
            );
        }  else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        // En caso de un error, tomar la exepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion === 'actualizar'){
    // importar la conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la base de datos
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
        $stmt->bind_param('ii',$estado, $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',

            );
        }  else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        // En caso de un error, tomar la exepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion === 'eliminar'){
    // importar la conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la base de datos
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
        $stmt->bind_param('i',$id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',

            );
        }  else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        // En caso de un error, tomar la exepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
