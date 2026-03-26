<?php
// Verificamos que el formulario se haya enviado por el método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Recolectamos y limpiamos los datos del formulario
    $nombre = htmlspecialchars($_POST['nombre']);
    $telefono = htmlspecialchars($_POST['telefono']);
    $email = htmlspecialchars($_POST['email']);
    $asunto = htmlspecialchars($_POST['asunto']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    // -----------------------------------------------------
    // AQUÍ PONES EL CORREO DONDE QUIERES RECIBIR LOS MENSAJES
    $destinatario = "antalogm@gmail.com"; 
    // -----------------------------------------------------

    $asunto_email = "Nuevo mensaje de la web: " . $asunto;

    // Diseñamos el cuerpo del correo
    $cuerpo = "Has recibido un nuevo mensaje desde el formulario de contacto de FRUIT JULS.\n\n";
    $cuerpo .= "Nombre: " . $nombre . "\n";
    $cuerpo .= "Teléfono: " . $telefono . "\n";
    $cuerpo .= "Correo: " . $email . "\n";
    $cuerpo .= "Asunto: " . $asunto . "\n";
    $cuerpo .= "Mensaje:\n" . $mensaje . "\n";

    // Configuración de los encabezados (Headers)
    // Es vital que el "From" use tu propio dominio para que Hostinger no lo marque como Spam
    $headers = "From: webmaster@" . $_SERVER['SERVER_NAME'] . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Enviamos el correo
    if (mail($destinatario, $asunto_email, $cuerpo, $headers)) {
        // Si se envía correctamente, redirigimos a una página de éxito (o lanzamos una alerta de JavaScript)
        echo "<script>
                alert('¡Gracias! Tu mensaje ha sido enviado correctamente.');
                window.location.href = 'contacto.html';
              </script>";
    } else {
        // Si hay un error
        echo "<script>
                alert('Hubo un error al enviar el mensaje. Por favor intenta más tarde.');
                window.history.back();
              </script>";
    }
} else {
    // Si alguien intenta entrar a enviar.php directamente desde el navegador, lo regresamos a contacto
    header("Location: contacto.html");
}
?>