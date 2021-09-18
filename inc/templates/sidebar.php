


<aside class="contenedor-proyectos" id="pro">


    <div class="panel crear-proyecto">
        <a href="#" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
    </div>

    <nav class="panel lista-proyectos">
        <h2>Proyectos</h2>
        <ul id="proyectos">
            <?php
                $proyectos = obtenerProyectos();
                if ($proyectos) {
                    foreach ($proyectos as $proyecto){
            ?>
                        <li class="menu-item">
                            <a href="index.php?id_proyecto=<?php echo $proyecto['id'] ?>" id="proyecto:<?php echo $proyecto['id'] ?>"  class="ocultar" >
                                <?php echo $proyecto['nombre'] ?>
                            </a>
                        </li>

            <?php    }

                    }
            ?>
        </ul>
    </nav>
</aside>