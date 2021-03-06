<?php
//die(json_encode($_POST));
$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear'){
    //código para crear los admin
    //hashear password
    $opciones = array(
      'cost' => 12
    );

    $hash_password = password_hash($password,PASSWORD_BCRYPT,$opciones);

    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realiza la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario,password) VALUES (?,?)");
        $stmt->bind_param('ss',$usuario,$hash_password);
        $stmt->execute();
        if ($stmt->affected_rows > 0){
            $respuesta = array(
              'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        }else{
            $respuesta = array(
              'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch (Exception $e){
        //en caso d error tomamos la excepción
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if ($accion === 'login'){
    //loguea a los admin
    include '../funciones/conexion.php';
    try {
        //selecionar el admin d la bd
        $stmt = $conn->prepare("SELECT usuario,id,password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s',$usuario);
        $stmt->execute();
        //loguear el user
        $stmt->bind_result($nombre_usuario,$id_usuario,$pass_usuario);
        $stmt->fetch();//los result

        if ($nombre_usuario){
            //el user existe entonces, verificar el pass
            if (password_verify($password,$pass_usuario)){
                //iniciar la sesion
                session_start();
                $_SESSION['nombre'] = $nombre_usuario;//$usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                //login correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            }else{
                //login incorrecto enviar error
                $respuesta = array(
                  'resultado' => 'Password Incorrecto'
                );
            }

        }else{
            $respuesta = array(
              'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    }catch (Exception $e){
        //en caso d error tomamos la excepción
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}