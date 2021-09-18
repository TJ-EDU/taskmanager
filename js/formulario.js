//console.log('probando si invoca a formulario js!');
eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit',validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();
    //let
    let usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    //console.log(usuario + " " + password);
    if (usuario === '' || password === ''){
        //la validación fallo
       swal({
           type: 'error',
           title: 'Error',
           text: 'Ambos campos son obligatorios'
       })
    }else{
        //amboss casos son correctos, ejecutar ajax
        //datos q se envian al servidor
       let datos = new FormData();
       datos.append('usuario', usuario);
       datos.append('password',password);
       datos.append('accion',tipo);
      // console.log(datos.get('usuario'));
        //crear el llamado a ajax
        let xhr = new XMLHttpRequest();
        //abrir la conexion
        xhr.open('POST','inc/modelos/modelo-admin.php',true);
        //retorno de datos
        xhr.onload = function () {
            if (this.status === 200){
                //console.log(xhr.responseText);
                //toma el string y convierte a objetos de js
                let respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                //si la respuesta es correcta
                if (respuesta.respuesta === 'correcto'){
                    //si es un nuevo usuario
                    if (respuesta.tipo === 'crear'){
                        swal({
                           title: 'Registro Exitoso',
                            text: 'Presiona ok para iniciar sesión ',
                            type: 'success'
                        })
                            .then(resultado => {
                                if (resultado.value){
                                    window.location.href = 'login.php';
                                }
                            })
                    }else if (respuesta.tipo === 'login'){
                        swal({
                            title: 'Login Correcto',
                            text: 'Presiona ok para abrir el dashboard',
                            type: 'success'
                        })// equival a function(resultado)
                            .then(resultado => {
                                if (resultado.value){
                                    window.location.href = 'index.php';
                                }
                            })
                    }
                }else{
                    // hubo un error
                    swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'
                    });
                }
            }
        }
        //enviar la petición
        xhr.send(datos);

    }
}
