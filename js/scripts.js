
eventListeners();

//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){
    //boton para crear proyectos
    document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);
    //boton para una nueva tarea
    if (document.querySelector('.nombre-tarea')){
        document.querySelector('.nueva-tarea').addEventListener('click',agregarTarea);
    }

    //boton para las acciones de tarea
    document.querySelector('.listado-pendientes').addEventListener('click',accionestareas);
}

function nuevoProyecto(e){
    e.preventDefault();
    console.log('Presionaste en nuevo proyecto');
    // crea un input para el nombre del nuevo proyecto o tarea
    let nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);
    //seleccionar el ID con el nuevoProyecto
   let inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
    //al presionar enter crea el proyecto
    inputNuevoProyecto.addEventListener('keypress', function (e){
        //console.log(e);
       let tecla = e.which || e.keyCode;
        if (tecla === 13){
           guardarProyectoDB(inputNuevoProyecto.value);
           listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto){

    //crear el llamado ajax
    let xhr = new XMLHttpRequest();
    //enviar datos por formdata
    let datos = new FormData();
    datos.append('proyecto',nombreProyecto);
    datos.append('accion','crear');

    //abrir la conexion
    xhr.open('POST','inc/modelos/modelo-proyecto.php',true);
    //en la carga
    xhr.onload = function (){
        if (this.status === 200){
           let respuesta = JSON.parse(xhr.responseText);
           let proyecto = respuesta.nombre_proyecto,
               id_proyecto = respuesta.id_insertado,
               tipo = respuesta.tipo,
               resultado = respuesta.respuesta;
           //comprobar inserción
            if (resultado === 'correcto'){
                //fue exitoso
                if (tipo === 'crear'){
                    //se creo nuevo proyecto
                    //inyectamos el html

                   let nuevoProyecto = document.createElement('li');

                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;


                    //agregar al html
                    listaProyectos.appendChild(nuevoProyecto);
                    //enviar alerta
                    swal({
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamente',
                        type: 'success'
                    })
                        .then(resultado => {
                            if (resultado.value){
                                //redireccionar a la nueva url
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })


                }else{
                    //se actualizo o elimino
                }
            }else{
                // hubo un error
                swal({
                    title: 'Error',
                    text: 'Hubo un error',
                    type: 'error'
                })
            }
        }
    }
    //enviar el request
    xhr.send(datos);
}

//agregar una nueva tarea al proyecto actual
function agregarTarea(e){
    e.preventDefault();
    let nombreTarea = document.querySelector('.nombre-tarea').value;
    //validar campo
    if (nombreTarea === ''){
        swal({
            title:'Error',
            text:'Una tarea no puede ir vacia',
            type:'error'
        })
    }else{
        //insertar
        let xhr = new XMLHttpRequest();

        let datos = new FormData();
        datos.append('tarea',nombreTarea);
        datos.append('accion','crear');
        datos.append('id_proyecto',document.querySelector('#id_proyecto').value);

        //abrir la conexion
        xhr.open('POST','inc/modelos/modelo-tareas.php',true);

        //ejecutar y respuesta
        xhr.onload = function (){
            if (this.status === 200){

                let respuesta = JSON.parse(xhr.responseText);
                //console.log(respuesta);
                // asignar valores
                let resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;
                if (resultado === 'correcto'){
                    // se agrego correctatemente
                    if (tipo === 'crear'){
                        // hubo un error
                        swal({
                            title: 'Tarea Creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamente',
                            type: 'success'
                        })
                        //seleccionar el parraf con la list vacia
                        let parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0){
                            document.querySelector('.lista-vacia').remove();
                        }

                        //construir
                        let nuevaTarea = document.createElement('li');
                        // ag el ID
                        nuevaTarea.id = 'tarea:'+id_insertado;
                        //ag la clase tarea
                        nuevaTarea.classList.add('tarea');
                        //construir html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;
                        // ag al HTML
                        let listado = document.querySelector('.listado-pendientes ul');
                        listado.append(nuevaTarea);
                        //limpiar formulario
                        document.querySelector('.agregar-tarea').reset();
                    }
                } else{
                    // hubo un error
                    swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'
                    })
                }
            }
        }
        //enviar la consulta
        xhr.send(datos);
    }
}

//cambia el estado de las tareas o las elimina
function accionestareas(e){
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')){
        if (e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target,0);
        }else{
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target,1);
        }
    }
    if (e.target.classList.contains('fa-trash')){
        swal({
            title: 'Seguro(a)?',
            text: "Esta acción no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                let tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
               eliminarTareaBD(tareaEliminar);

                // Borrar del HTML
                tareaEliminar.remove();

                swal(
                    'Eliminado!',
                    'La tarea fue eliminada!.',
                    'success'
                )
            }
        })
    }
}

//completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado){
    let idTarea = tarea.parentElement.parentElement.id.split(':');
    let xhr = new XMLHttpRequest();
    let datos = new FormData();
    datos.append('id',idTarea[1]);
    datos.append('accion','actualizar');
    datos.append('estado',estado);
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    xhr.onload = function (){
        if (this.status === 200){
           // console.log(xhr.responseText);
            console.log(JSON.parse(xhr.responseText));

        }
    }

    //enviar la petición
    xhr.send(datos);
}

//elimina una tarea
function eliminarTareaBD(tarea){
    let idTarea = tarea.id.split(':');
    let xhr = new XMLHttpRequest();
    let datos = new FormData();
    datos.append('id',idTarea[1]);
    datos.append('accion','eliminar');

    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    xhr.onload = function (){
        if (this.status === 200){
            // console.log(xhr.responseText);
            console.log(JSON.parse(xhr.responseText));
            // comrueba si hay tareas restantes
            let listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0){
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }
        }
    }

    //enviar la petición
    xhr.send(datos);
}



function nav() {

    let div = document.getElementById('pro');
    div.style.display = 'none';
    return false;
}

function ocultarSidebar(){

    let div = document.getElementById('pro');
    div.style.display = 'none';
    event.preventDefault();

}

function mostrarSidebar(){
    let div = document.getElementById('pro');
    div.style.display = 'block';
    event.preventDefault();
}



function menuDinamico() {

    const burgerMenuBtn = document.querySelector("#burger-menu-button");
    const menuItems = document.querySelectorAll(".menu-item");

    burgerMenuBtn.addEventListener("click", function () {
        //document.body.classList.toggle("mobile-menu-active");
        document.getElementById("pro").classList.toggle("mobile-menu-active");

        document.getElementById("pro2").style.display = 'none';

    });


    menuItems.forEach(function (menuItem) {

        menuItem.addEventListener("click", function () {

            document.body.classList.remove("mobile-menu-active");

        });
    });
}

menuDinamico();

