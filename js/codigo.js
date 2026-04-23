console.log("cargao");
/*
VARIABLES GLOBALES, CONSTANTES GLOBALES
*/

/**
 * Genero un sistema para manejar todos mis datos
 */
const SISTEMA = new Sistema("Mi app");
//EJECUTAMOS LA PRECARGA ENSEGUIDA DE CREAR EL SISTEMA
SISTEMA.precargarDatos();

const CLASE_PASEADOR_NAVEGACION = "pagina-paseador";
const CLASE_USUARIO_NAVEGACION = "pagina-usuario";

const CLASE_PASEADOR_DIV = "div-paseador";
const CLASE_USUARIO_DIV = "div-usuario";

/*

FUNCIONES PARA EL INICIO

*/
iniciarAplicacion();

/*

EVENTOS

*/

document.querySelector("#btnLogin").addEventListener("click", login);

document.querySelector("#btnLogout").addEventListener("click", logout);

document
  .querySelector("#btnRegistrase")
  .addEventListener("click", mostrarPaginaRegistro);

document
  .querySelector("#btnCancelarRegistro")
  .addEventListener("click", volverALogin);

document
  .querySelector("#btnRegistro")
  .addEventListener("click", registrarUsuario);

//Le agrega el add event listener a todos los elementos de navegacion
habilitarBotonesParaNavegar();

function login() {
  //limpia errores
  document.querySelector("#pErroresLogin").innerHTML = "";

  let usuarioIngresado = document.querySelector("#txtLoginUsuario").value;
  let passIngresado = document.querySelector("#txtLoginPassword").value;

  if (SISTEMA.loginUsuario(usuarioIngresado, passIngresado)) {
    loginExitoso(usuarioIngresado);
  } else {
    document.querySelector("#pErroresLogin").innerHTML =
      "Usuario o contraseña incorrectos";
  }

  document.querySelector("#txtLoginPassword").value = "";
}

function registrarUsuario() {
  document.querySelector("#pErroresRegistro").innerHTML = "";

  let nombreIngresado = document.querySelector(
    "#txtRegistroUsuarioNombre"
  ).value;
  let PerroIngresado = document.querySelector("#txtRegistroPerroNombre").value;
  let passIngresado = document.querySelector("#txtRegistroUsuarioPass").value;
  let tamanoIngresado = document.querySelector("#slcTipoDePerro").value;
  let erroresAlAgregarUsuario = SISTEMA.agregarUsuario(
    nombreIngresado,
    passIngresado,
    false, //No es paseador
    PerroIngresado,
    tamanoIngresado
  );

  /* Si no hubo errores, registrar, si no mostrar mensaje */
  if (erroresAlAgregarUsuario.length === 0) {
    volverALogin();
  } else {
    document.querySelector("#pErroresRegistro").innerHTML =
      erroresAlAgregarUsuario;
  }
}

function logout() {
  //SISTEMA.logout();
  ocultarElementosPorClase("pagina");
  ocultarElementosPorClase(CLASE_PASEADOR_NAVEGACION);
  ocultarElementosPorClase(CLASE_USUARIO_NAVEGACION);
  ocultarInfoPaseador();

  document.querySelector("#txtLoginUsuario").value = "";
  document.querySelector("#txtLoginPassword").value = "";
  document.querySelector("#pErroresLogin").innerHTML = "";
  document.querySelector("#slcTipoDePerro").value = "select";
  document.querySelector("#divLogin").style.display = "block";
}

/**
 * Oculta todo lo que no es visible al entrar a la página
 */
function iniciarAplicacion() {
  ocultarElementosPorClase(CLASE_PASEADOR_NAVEGACION);
  ocultarElementosPorClase(CLASE_USUARIO_NAVEGACION);
  ocultarElementosPorClase("pagina");
  mostrarElementoPorID("#divLogin");
}

/**
 * Oculta los divs de login y muestra los correspondientes al usuario
 * @param {String} pNombre
 */
function loginExitoso(pNombre) {
  document.querySelector("#txtLoginUsuario").value = "";
  document.querySelector("#divLogin").style.display = "none";

  const esPaseador = SISTEMA.buscarUnPaseadorPorNombre(pNombre) !== null;

  if (esPaseador) {
    ocultarElementosPorClase(CLASE_USUARIO_NAVEGACION);
    mostrarElementosPorClase(CLASE_PASEADOR_NAVEGACION);
    mostrarElementoPorID("#divPaginaPaseador");

    // Mostrar mensaje personalizado
    const paseador = SISTEMA.buscarUnPaseadorPorNombre(pNombre);
    document.querySelector(
      "#hPaginaPaseador"
    ).textContent = `Hola paseador, ${paseador.nombreCompletoPaseador}`;
  } else {
    ocultarElementosPorClase(CLASE_PASEADOR_NAVEGACION);
    mostrarElementosPorClase(CLASE_USUARIO_NAVEGACION);
    mostrarElementoPorID("#divPaginaUsuario");
    document.querySelector(
      "#hPaginaUsuario"
    ).textContent = `Bienvenido usuario, ${pNombre}`;
    llenarListadoDePaseadores();
    mostrarEstadoDeContratacionesDeUsuario(pNombre);
  }
}

function mostrarElementoPorID(id) {
  ocultarInfoPaseador(); // mover antes para evitar parpadeo de info
  ocultarElementosPorClase(CLASE_PASEADOR_DIV);
  ocultarElementosPorClase(CLASE_USUARIO_DIV);
  document.querySelector(id).style.display = "block";
  limpiarMensajesEstadoContratacion();
}

function mostrarPaginaRegistro() {
  ocultarElementosPorClase("pagina");
  document.querySelector("#divRegistro").style.display = "block";
}

function volverALogin() {
  logout();
}

function ocultarElementosPorClase(clase) {
  //document.querySelector(elemento).style.display = "none";

  //document.querySelectorAll me trae un ARRAY de elementos HTML
  let elementosParaOcultar = document.querySelectorAll("." + clase);

  for (let i = 0; i < elementosParaOcultar.length; i++) {
    elementosParaOcultar[i].style.display = "none";
  }
}

function mostrarElementosPorClase(clase) {
  let elementosParaMostrar = document.querySelectorAll("." + clase);

  for (let i = 0; i < elementosParaMostrar.length; i++) {
    elementosParaMostrar[i].style.display = "block";
  }
}

function habilitarBotonesParaNavegar() {
  let botones = document.querySelectorAll(".btn-navegacion");

  for (let i = 0; i < botones.length; i++) {
    let boton = botones[i];
    boton.addEventListener("click", mostrarPaginaDelBoton);
  }
}

/* llena la lista de paseadores para los usuarios */
function llenarListadoDePaseadores() {
  const tbody = document.querySelector("#tblListadoPaseadores");
  tbody.innerHTML = "";

  const paseadores = SISTEMA.paseadores;

  for (let i = 0; i < paseadores.length; i++) {
    const paseador = paseadores[i];

    // Calcular la cantidad de contrataciones aceptadas para este paseador
    let cantidad = 0;
    for (let j = 0; j < SISTEMA.contrataciones.length; j++) {
      const contratacion = SISTEMA.contrataciones[j];
      if (
        contratacion.paseador.nombrePaseador === paseador.nombrePaseador &&
        contratacion.estado === "aceptada"
      ) {
        cantidad += 1;
      }
    }

    const fila = `
      <tr>
        <td>${paseador.nombreCompletoPaseador}</td>
        <td>${cantidad}</td>
        <td><button class="btnMasInfo" data-nombre-paseador="${paseador.nombrePaseador}">Más información</button></td>
      </tr>
    `;

    tbody.innerHTML += fila;
  }

  darFuncionalidadBotonesMasInfo();
  darFuncionalidadBotonesContratar();
}
/* hace que funcione el boton de información */
function darFuncionalidadBotonesMasInfo() {
  const botones = document.querySelectorAll(".btnMasInfo");
  for (let boton of botones) {
    boton.addEventListener("click", function () {
      const nombrePaseador = this.getAttribute("data-nombre-paseador");
      const paseador = SISTEMA.buscarUnPaseadorPorNombre(nombrePaseador);
      const cliente = SISTEMA.usuarioLogueado;

      const infoDiv = document.querySelector("#infoPaseador");
      const perrosAsignados = SISTEMA.contrataciones.filter(function (c) {
        return (
          c.paseador.nombrePaseador === paseador.nombrePaseador &&
          c.estado === "aceptada"
        );
      }).length;

      infoDiv.innerHTML = `
  <strong>Nombre completo:</strong> ${paseador.nombreCompletoPaseador}<br>
  <strong>Nombre de usuario:</strong> ${paseador.nombrePaseador}<br>
  <strong>Perros asignados:</strong> ${perrosAsignados}<br>
`;

      const resultado = SISTEMA.puedeContratar(cliente, paseador);

      if (resultado === null) {
        // Puede contratar
        infoDiv.innerHTML += `
          <button class="btnContratarPaseador" data-nombre-paseador="${paseador.nombrePaseador}">Contratar</button>
        `;
      } else {
        // No puede, mostramos mensaje
        infoDiv.innerHTML += `<p style="color: red;"><strong>${resultado}</strong></p>`;
      }
      setTimeout(function () {
        borrarMensajesTemporales(infoDiv);
      }, 4000);
      infoDiv.style.display = "block";
      darFuncionalidadBotonesContratar();
    });
  }
}

function darFuncionalidadBotonesContratar() {
  const botones = document.querySelectorAll(".btnContratarPaseador");

  for (let boton of botones) {
    boton.addEventListener("click", function () {
      const nombrePaseador = this.getAttribute("data-nombre-paseador");
      const paseador = SISTEMA.buscarUnPaseadorPorNombre(nombrePaseador);
      const cliente = SISTEMA.usuarioLogueado;

      const resultado = SISTEMA.crearContratacion(
        cliente.nombre,
        nombrePaseador
      );
      const estadoContratacion = document.querySelector("#estadoContratacion");

      if (resultado.includes("exitosamente")) {
        mostrarEstadoDeContratacionesDeUsuario(cliente.nombre);

        const mensajeExito = document.createElement("p");
        mensajeExito.style.color = "green";
        mensajeExito.innerHTML = `<strong>${resultado}</strong>`;
        estadoContratacion.appendChild(mensajeExito);
        estadoContratacion.style.display = "block";

        setTimeout(function () {
          borrarMensajesTemporales(estadoContratacion);
        }, 3000);
      } else {
        const mensajeError = document.createElement("p");
        mensajeError.style.color = "red";
        mensajeError.innerHTML = `<strong>${resultado}</strong>`;
        estadoContratacion.appendChild(mensajeError);
        estadoContratacion.style.display = "block";

        setTimeout(function () {
          borrarMensajesTemporales(estadoContratacion);
        }, 3000);
      }
    });
  }
}

/** oculta la información del paseador al moverte de página */
function ocultarInfoPaseador() {
  const infoDiv = document.querySelector("#infoPaseador");
  infoDiv.style.display = "none";
  infoDiv.innerHTML = "";
}

/** mantiene la contratación abajo de la tabla al moverte de página, muestra los diferentes mensajes de error o exito y los botones */
function mostrarEstadoDeContratacionesDeUsuario(
  nombreUsuario,
  mostrarMensajeCancelado
) {
  const estadoContratacion = document.querySelector("#estadoContratacion");
  estadoContratacion.innerHTML = "";
  estadoContratacion.style.display = "none";

  const contrataciones = SISTEMA.contrataciones.filter(function (c) {
    return (
      c.cliente.nombre.toLowerCase() === nombreUsuario.toLowerCase() &&
      c.estado !== "rechazada"
    );
  });

  if (contrataciones.length > 0) {
    let contenido = "<strong>Contrataciones del usuario:</strong><br><br>";
    for (let i = 0; i < contrataciones.length; i++) {
      let c = contrataciones[i];
      contenido +=
        "Paseador: " +
        c.paseador.nombreCompletoPaseador +
        "<br>" +
        "Estado: " +
        c.estado;

      if (c.estado === "rechazada") {
        contenido +=
          '<p style="color:red;"><strong> (rechazada automáticamente por incompatibilidad de tamaño)</strong></p>';
      }

      contenido += "<br>";

      if (c.estado === "pendiente") {
        contenido +=
          '<button class="btnCancelarContratacion" data-cliente="' +
          c.cliente.nombre +
          '">Cancelar contratación</button>';
      }

      contenido += "<br><br>";
    }

    estadoContratacion.innerHTML = contenido;
    estadoContratacion.style.display = "block";

    setTimeout(function () {
      agregarFuncionalidadCancelarContratacion();
    }, 0);
  } else if (mostrarMensajeCancelado) {
    estadoContratacion.innerHTML =
      '<p style="color: green;"><strong>La contratación fue cancelada con éxito.</strong></p>';
    estadoContratacion.style.display = "block";
  }
  setTimeout(function () {
    borrarMensajesTemporales(estadoContratacion);
  }, 4000);
}

/**Borra el mensaje de error o exito al moverte de página */
function limpiarMensajesEstadoContratacion() {
  const ids = ["estadoContratacion", "infoPaseador", "pErrorCupo"];
  for (let id of ids) {
    const contenedor = document.querySelector("#" + id);
    if (contenedor) {
      borrarMensajesTemporales(contenedor);
    }
  }
}

/* BOTON DE CANCELACIÓN DEL USUARIO */
function agregarFuncionalidadCancelarContratacion() {
  const botones = document.querySelectorAll(".btnCancelarContratacion");
  for (let boton of botones) {
    boton.addEventListener("click", function () {
      const nombreCliente = this.getAttribute("data-cliente");
      const ok = SISTEMA.cancelarContratacionDeCliente(nombreCliente);
      if (ok) {
        mostrarEstadoDeContratacionesDeUsuario(nombreCliente, true);
      }
    });
  }
}

function mostrarPaginaDelBoton() {
  let boton = this;
  let paginaQueQuieroMostrar = boton.getAttribute("data-seccion-para-mostrar");

  if (paginaQueQuieroMostrar !== null) {
    mostrarElementoPorID("#" + paginaQueQuieroMostrar);

    if (paginaQueQuieroMostrar === "contratacionesPendientes") {
      SISTEMA.mostrarContratacionesPendientesParaPaseador();
    }
    if (paginaQueQuieroMostrar === "misContrataciones") {
      SISTEMA.mostrarContratacionesAceptadasParaPaseador();
    }
  }
}

function borrarMensajesTemporales(contenedor) {
  const mensajes = contenedor.querySelectorAll("p");
  for (let msg of mensajes) {
    const color = msg.style.color.toLowerCase();
    if (color === "red" || color === "green") {
      msg.remove();
    }
  }
  if (contenedor.innerText.trim() === "") {
    contenedor.style.display = "none";
  }
}
