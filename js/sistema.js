class Sistema {
  constructor(pNombreAplicacion) {
    this.usuarios = [];
    this.paseadores = [];
    this.contrataciones = [];
    this.nombreAplicacion = pNombreAplicacion;
    this.usuarioLogueado = null;
  }

  loginUsuario(pNombre, pPass) {
    let usuario = this.buscarUnUsuarioPorNombre(pNombre);
    if (usuario !== null && usuario.password === pPass) {
      this.usuarioLogueado = usuario;
      return true;
    }
    let paseadores = this.buscarUnPaseadorPorNombre(pNombre);
    if (paseadores !== null && paseadores.passwordPaseador === pPass) {
      this.usuarioLogueado = paseadores;
      return true;
    }
    return false;
  }

  buscarUnUsuarioPorNombre(pNombre) {
    let usuarioEncontrado = null;
    let i = 0;
    while (usuarioEncontrado === null && i < this.usuarios.length) {
      if (this.usuarios[i].nombre.toUpperCase() === pNombre.toUpperCase()) {
        usuarioEncontrado = this.usuarios[i];
      }
      i++;
    }
    return usuarioEncontrado;
  }

  buscarUnPaseadorPorNombre(pNombrePaseador) {
    let usuarioEncontrado = null;
    let i = 0;
    while (usuarioEncontrado === null && i < this.paseadores.length) {
      if (
        this.paseadores[i].nombrePaseador.toUpperCase() ===
        pNombrePaseador.toUpperCase()
      ) {
        usuarioEncontrado = this.paseadores[i];
      }
      i++;
    }
    return usuarioEncontrado;
  }

  existePaseador(nombre) {
    return this.buscarUnPaseadorPorNombre(nombre) !== null;
  }

  existeUsuario(pNombre) {
    return this.buscarUnUsuarioPorNombre(pNombre) !== null;
  }

  esUnPasswordValido(pPass) {
    let tieneNumero = false;
    let tieneMayuscula = false;
    let tieneMinuscula = false;
    let i = 0;
    while (
      (!tieneMayuscula || !tieneMinuscula || !tieneNumero) &&
      i < pPass.length
    ) {
      let char = pPass.charCodeAt(i);
      if (char >= 48 && char <= 57) tieneNumero = true;
      else if (char >= 65 && char <= 90) tieneMayuscula = true;
      else if (char >= 97 && char <= 122) tieneMinuscula = true;
      i++;
    }
    return tieneNumero && pPass.length >= 5 && tieneMayuscula && tieneMinuscula;
  }

  agregarPaseador(
    nombrePaseador,
    passwordPaseador,
    esPaseador,
    nombreCompletoPaseador
  ) {
    if (!nombrePaseador || !passwordPaseador || !nombreCompletoPaseador) {
      console.warn("Intento de agregar paseador inválido. Datos incompletos.");
      return;
    }

    if (this.existePaseador(nombrePaseador)) {
      console.warn("Paseador ya existente:", nombrePaseador);
      return;
    }

    let nuevoPaseador = new Paseador(
      nombrePaseador,
      passwordPaseador,
      esPaseador,
      nombreCompletoPaseador
    );
    this.paseadores.push(nuevoPaseador);
  }

  agregarUsuario(pNombre, pPassword, pEsPaseador, pNombrePerro, pTamanoPerro) {
    let errores = this.validarDatosDeUsuario(
      pNombre,
      pPassword,
      pNombrePerro,
      pTamanoPerro
    );
    if (errores.length === 0) {
      let unUsuario = new Usuario(
        pNombre,
        pPassword,
        pEsPaseador,
        pNombrePerro,
        pTamanoPerro
      );
      this.usuarios.push(unUsuario);

      document.querySelector("#txtRegistroUsuarioNombre").value = "";
      document.querySelector("#txtRegistroUsuarioPass").value = "";
      document.querySelector("#txtRegistroPerroNombre").value = "";
      document.querySelector("#slcTipoDePerro").value = "select";
      document.querySelector("#pErroresRegistro").innerHTML = "";
    }
    return errores;
  }

  esPaseador(pNombre) {
    let usuario = this.buscarUnUsuarioPorNombre(pNombre);
    return usuario?.esPaseador === true;
  }

  validarDatosDeUsuario(pNombre, pPassword, pNombrePerro, pTamanoPerro) {
    let errores = "";
    if (this.existeUsuario(pNombre)) {
      errores += "<br>El nombre de usuario no está disponible";
    }
    if (!pNombre || pNombre.trim() === "") {
      errores += "Ingrese nombre de usuario";
    }
    if (!this.esUnPasswordValido(pPassword)) {
      errores +=
        "<br>El Password debe tener al menos un número, una mayúscula y 5 caracteres";
    }
    if (!pNombrePerro || pNombrePerro.trim() === "") {
      errores += "<br>El nombre del perro no puede ser nulo";
    }
    if (
      !pTamanoPerro ||
      pTamanoPerro.trim() === "" ||
      pTamanoPerro === "select"
    ) {
      errores += "<br>Debe elegir un tamaño de perro";
    }
    return errores;
  }

  obtenerUsuariosPaseadores() {
    return this.usuarios.filter((u) => u.esPaseador);
  }

  existeElementoEnArray(array, elemento) {
    return array.indexOf(elemento) >= 0;
  }

  crearContratacion(nombreCliente, nombrePaseador) {
    const cliente = this.buscarUnUsuarioPorNombre(nombreCliente);
    const paseador = this.buscarUnPaseadorPorNombre(nombrePaseador);

    if (cliente && paseador) {
      const yaTiene = this.contrataciones.some(
        (c) =>
          c.cliente.nombre.toLowerCase() === nombreCliente.toLowerCase() &&
          c.estado === "pendiente"
      );

      if (yaTiene) {
        return "Ya tenés una contratación pendiente. Cancele la actual o espere respuesta de un paseador.";
      }

      const nuevaContratacion = new Contratacion(cliente, paseador);
      this.contrataciones.push(nuevaContratacion);
      return "Contratación registrada exitosamente.";
    } else {
      return "Cliente o paseador no encontrado.";
    }
  }

  cancelarContratacionDeCliente(nombreCliente) {
    const cliente = this.buscarUnUsuarioPorNombre(nombreCliente);
    if (!cliente) return false;
    const index = this.contrataciones.findIndex(
      (c) => c.cliente.id === cliente.id && c.estado === "pendiente"
    );
    if (index >= 0) {
      this.contrataciones.splice(index, 1);
      return true;
    }
    return false;
  }

  mostrarContratacionesPendientesParaPaseador() {
    const paseador = this.usuarioLogueado;
    const tbody = document.querySelector("#tblAceptarContrataciones");
    tbody.innerHTML = "";

    let bloqueados = this.determinarTamanosBloqueados(paseador);

    // Rechazar automáticamente contrataciones incompatibles
    for (let i = 0; i < this.contrataciones.length; i++) {
      let c = this.contrataciones[i];
      if (
        c.paseador.nombrePaseador === paseador.nombrePaseador &&
        c.estado === "pendiente" &&
        bloqueados.includes(c.cliente.tamanoPerro)
      ) {
        const index = this.contrataciones.indexOf(c);
        if (index !== -1) {
          this.contrataciones.splice(index, 1);
        }

        // Si el cliente afectado está logueado, actualizamos su vista
        if (
          this.usuarioLogueado !== null &&
          this.usuarioLogueado.nombre === c.cliente.nombre
        ) {
          mostrarEstadoDeContratacionesDeUsuario(c.cliente.nombre);
          console.log(
            "Se rechazó automáticamente la contratación de " + c.cliente.nombre
          );
        }
      }
    }

    // Mostrar solo las pendientes válidas
    const pendientes = this.contrataciones.filter(function (c) {
      return (
        c.paseador.nombrePaseador === paseador.nombrePaseador &&
        c.estado === "pendiente"
      );
    });

    for (let i = 0; i < pendientes.length; i++) {
      let c = pendientes[i];
      tbody.innerHTML += `
        <tr>
          <td>${c.cliente.nombre}</td>
          <td>${c.cliente.tamanoPerro}</td>
          <td><button class="btnAceptar" data-cliente="${c.cliente.nombre}">Aceptar</button></td>
          <td><button class="btnRechazar" data-cliente="${c.cliente.nombre}">Rechazar</button></td>
        </tr>
      `;
    }

    const botonesAceptar = document.querySelectorAll(".btnAceptar");
    for (let i = 0; i < botonesAceptar.length; i++) {
      let boton = botonesAceptar[i];
      boton.addEventListener("click", function () {
        const nombreCliente = boton.getAttribute("data-cliente");
        const contrato = SISTEMA.contrataciones.find(function (c) {
          return (
            c.cliente.nombre === nombreCliente &&
            c.paseador.nombrePaseador ===
              SISTEMA.usuarioLogueado.nombrePaseador &&
            c.estado === "pendiente"
          );
        });

        let pError = document.querySelector("#pErrorCupo");

        // Si no existe el elemento, lo creamos dinámicamente
        if (!pError) {
          const contenedor = document.querySelector(
            "#contratacionesPendientes"
          );
          pError = document.createElement("p");
          pError.id = "pErrorCupo";
          pError.style.color = "red";
          contenedor.appendChild(pError);
        }

        pError.textContent = ""; // Limpia errores anteriores

        // CUPOS TOTALES
        if (contrato) {
          const cuposNecesarios = SISTEMA.calcularCupoPortamano(
            contrato.cliente.tamanoPerro
          );
          const paseador = contrato.paseador;
          const cuposTotales = 8; // <---- CUPOS
          const cuposUsados =
            SISTEMA.calcularCuposOcupadosPorPaseador(paseador);

          if (cuposUsados + cuposNecesarios > cuposTotales) {
            pError.textContent =
              "No hay cupos suficientes para aceptar este perro.";
            setTimeout(function () {
              pError.textContent = "";
            }, 3000);
            return;
          }

          contrato.estado = "aceptada";
          // Rechazar automáticamente contrataciones incompatibles
          let tamanioNuevo = contrato.cliente.tamanoPerro;
          let bloqueados = [];

          if (tamanioNuevo === "Chico") {
            bloqueados.push("Grande");
          } else if (tamanioNuevo === "Grande") {
            bloqueados.push("Chico");
          }

          // Recorremos las contrataciones pendientes para este paseador
          for (let i = 0; i < SISTEMA.contrataciones.length; i++) {
            let c = SISTEMA.contrataciones[i];
            if (
              c.paseador.nombrePaseador === paseador.nombrePaseador &&
              c.estado === "pendiente" &&
              bloqueados.includes(c.cliente.tamanoPerro)
            ) {
              c.estado = "rechazada";
            }
          }

          SISTEMA.mostrarContratacionesPendientesParaPaseador();
          SISTEMA.mostrarContratacionesAceptadasParaPaseador();

          if (typeof llenarListadoDePaseadores === "function") {
            llenarListadoDePaseadores();
          }
        }
      });
    }

    const botonesRechazar = document.querySelectorAll(".btnRechazar");
    for (let i = 0; i < botonesRechazar.length; i++) {
      let boton = botonesRechazar[i];
      boton.addEventListener("click", function () {
        const nombreCliente = boton.getAttribute("data-cliente");
        const index = SISTEMA.contrataciones.findIndex(function (c) {
          return (
            c.cliente.nombre === nombreCliente &&
            c.paseador.nombrePaseador ===
              SISTEMA.usuarioLogueado.nombrePaseador &&
            c.estado === "pendiente"
          );
        });

        if (index >= 0) {
          let contratacionRechazada = SISTEMA.contrataciones[index];
          SISTEMA.contrataciones.splice(index, 1);

          SISTEMA.mostrarContratacionesPendientesParaPaseador();
          SISTEMA.mostrarContratacionesAceptadasParaPaseador();

          if (!SISTEMA.usuarioLogueado.esPaseador) {
            llenarListadoDePaseadores();
          }
          if (!SISTEMA.usuarioLogueado.esPaseador) {
            mostrarEstadoDeContratacionesDeUsuario(
              SISTEMA.usuarioLogueado.nombre
            );
          }
        }
      });
    }
  }

  mostrarContratacionesAceptadasParaPaseador() {
    const paseador = this.usuarioLogueado;
    const tbody = document.querySelector("#tblMisContrataciones");
    if (!tbody) return;

    tbody.innerHTML = "";

    const aceptadas = this.contrataciones.filter(
      (c) =>
        c.paseador.nombrePaseador === paseador.nombrePaseador &&
        c.estado === "aceptada"
    );

    for (let c of aceptadas) {
      tbody.innerHTML += `
        <tr>
          <td>${c.cliente.nombre}</td>
          <td>${c.cliente.tamanoPerro}</td>
          <td>${c.estado}</td>
        </tr>
      `;
    }
  }

  calcularCupoPortamano(tamano) {
    if (tamano === "Chico") return 1;
    if (tamano === "Mediano") return 2;
    if (tamano === "Grande") return 4;
    return 0;
  }

  calcularCuposOcupadosPorPaseador(paseador) {
    let cupos = 0;
    for (let c of this.contrataciones) {
      if (
        c.paseador.nombrePaseador === paseador.nombrePaseador &&
        c.estado === "aceptada"
      ) {
        cupos += this.calcularCupoPortamano(c.cliente.tamanoPerro);
      }
    }
    return cupos;
  }

  determinarTamanosBloqueados(paseador) {
    let aceptadas = this.contrataciones.filter(function (c) {
      return (
        c.paseador.nombrePaseador === paseador.nombrePaseador &&
        c.estado === "aceptada"
      );
    });

    let tamanios = aceptadas.map(function (c) {
      return c.cliente.tamanoPerro;
    });

    if (tamanios.includes("Chico")) {
      return ["Grande"];
    }

    if (tamanios.includes("Grande")) {
      return ["Chico"];
    }

    return [];
  }

  agregarEventosAceptarYRechazar() {
    const botonesAceptar = document.querySelectorAll(".btnAceptar");
    for (let i = 0; i < botonesAceptar.length; i++) {
      let boton = botonesAceptar[i];
      boton.addEventListener("click", function () {
        const nombreCliente = this.getAttribute("data-cliente");
        const contrato = SISTEMA.contrataciones.find(function (c) {
          return (
            c.cliente.nombre === nombreCliente &&
            c.paseador.nombrePaseador ===
              SISTEMA.usuarioLogueado.nombrePaseador &&
            c.estado === "pendiente"
          );
        });

        if (contrato) {
          contrato.estado = "aceptada";

          SISTEMA.mostrarContratacionesPendientesParaPaseador();
          SISTEMA.mostrarContratacionesAceptadasParaPaseador();

          if (typeof llenarListadoDePaseadores === "function") {
            llenarListadoDePaseadores();
          }
        }
      });
    }

    const botonesRechazar = document.querySelectorAll(".btnRechazar");
    for (let i = 0; i < botonesRechazar.length; i++) {
      let boton = botonesRechazar[i];
      boton.addEventListener("click", function () {
        const nombreCliente = this.getAttribute("data-cliente");
        const index = SISTEMA.contrataciones.findIndex(function (c) {
          return (
            c.cliente.nombre === nombreCliente &&
            c.paseador.nombrePaseador ===
              SISTEMA.usuarioLogueado.nombrePaseador &&
            c.estado === "pendiente"
          );
        });

        if (index >= 0) {
          let contratacionRechazada = SISTEMA.contrataciones[index];
          contratacionRechazada.estado = "rechazada";

          SISTEMA.mostrarContratacionesPendientesParaPaseador();
          SISTEMA.mostrarContratacionesAceptadasParaPaseador();

          if (typeof llenarListadoDePaseadores === "function") {
            llenarListadoDePaseadores();
          }
        }
      });
    }
  }

  puedeContratar(cliente, paseador) {
    if (!cliente || !paseador) return "Cliente o paseador inválido.";

    const yaTiene = this.contrataciones.some(
      (c) =>
        c.cliente.id === cliente.id &&
        (c.estado === "pendiente" || c.estado === "aceptada")
    );
    if (yaTiene) return "Ya tenés una contratación pendiente o aceptada.";

    // CUPOS
    const cuposTotales = 8;
    const cuposUsados = this.calcularCuposOcupadosPorPaseador(paseador);
    const cuposDisponibles = cuposTotales - cuposUsados;
    const cuposNecesarios = this.calcularCupoPortamano(cliente.tamanoPerro);
    if (cuposNecesarios > cuposDisponibles) {
      return `El paseador no tiene suficientes cupos para tu perro (${cliente.tamanoPerro}).`;
    }

    // INCOMPATIBILIDAD DE TAMAÑO
    const tamanosAceptados = this.contrataciones
      .filter(
        (c) =>
          c.paseador.nombrePaseador === paseador.nombrePaseador &&
          c.estado === "aceptada"
      )
      .map((c) => c.cliente.tamanoPerro);

    if (
      (cliente.tamanoPerro === "Chico" &&
        tamanosAceptados.includes("Grande")) ||
      (cliente.tamanoPerro === "Grande" && tamanosAceptados.includes("Chico"))
    ) {
      return `No podés contratar a este paseador porque ya tiene asignado un perro incompatible con el tuyo (${cliente.tamanoPerro}).`;
    }

    return null;
  }

  precargarDatos() {
    const usuarios = [
      ["sofia35", "Sofroc9", "Rocky", "Grande"],
      ["juampi_89", "Perro9B", "Toby", "Mediano"],
      ["maria.luz", "Casa1c", "Luna", "Chico"],
      ["carlos77", "Clave2D", "Max", "Grande"],
      ["luciana23", "Sol34X", "Nina", "Chico"],
      ["fer_1980", "Paseo8e", "Bruno", "Mediano"],
      ["vale.ram", "Casa5K", "Lola", "Chico"],
      ["agusroldan", "Amor6l", "Simba", "Grande"],
      ["pilar_10", "Sol77z", "Chispa", "Mediano"],
      ["diego34", "Clave3H", "Zeus", "Chico"],
      ["rocio98", "Gato5x", "Mora", "Grande"],
      ["tomi.44", "Perro7C", "Rex", "Mediano"],
      ["meli_11", "Hola2w", "Kira", "Chico"],
      ["danielm", "Casa3N", "Duque", "Grande"],
      ["ari.luna", "Amor9j", "Nala", "Mediano"],
      ["franco88", "Pass4R", "Chester", "Chico"],
      ["noelia_19", "Clave7T", "Fiona", "Grande"],
      ["gastonf", "Gato6S", "Thor", "Mediano"],
      ["ivana23", "Sol1Vb", "Boby", "Chico"],
      ["lucho.paz", "Paseo2Z", "Balu", "Grande"],
    ];

    for (let i = 0; i < usuarios.length; i++) {
      let nombre = usuarios[i][0];
      let pass = usuarios[i][1];
      let perro = usuarios[i][2];
      let tamano = usuarios[i][3];
      console.log(this.agregarUsuario(nombre, pass, false, perro, tamano));
    }

    const paseadores = [
      ["paseoMar", "Clave444A", "Mariano Gago"],
      ["sofiaWalks", "Clave2B", "Sofía Martínez"],
      ["lucasDog", "Clave3C", "Lucas Viñoles"],
      ["mica1301", "Clave4D", "Micaela Milagro"],
      ["rodrigoZ", "Clave5E", "Rodrigo Zapata"],
    ];

    for (let i = 0; i < paseadores.length; i++) {
      let usuario = paseadores[i][0];
      let pass = paseadores[i][1];
      let nombreCompleto = paseadores[i][2];
      console.log(this.agregarPaseador(usuario, pass, true, nombreCompleto));
    }

    const contrataciones = [
      ["ivana23", "paseoMar"],
      ["juampi_89", "sofiaWalks"],
      ["maria.luz", "lucasDog"],
      ["carlos77", "mica1301"],
      ["luciana23", "rodrigoZ"],
      ["fer_1980", "paseoMar"],
      ["vale.ram", "sofiaWalks"],
      ["agusroldan", "lucasDog"],
      ["pilar_10", "mica1301"],
      ["diego34", "rodrigoZ"],
    ];

    for (let i = 0; i < contrataciones.length; i++) {
      let cliente = contrataciones[i][0];
      let paseador = contrataciones[i][1];

      let mensaje = this.crearContratacion(cliente, paseador);
      console.log(
        "Contratación: " + cliente + " con " + paseador + " => " + mensaje
      );

      // Aceptar algunas contrataciones específicas
      if (
        cliente === "ivana23" ||
        cliente === "carlos77" ||
        cliente === "vale.ram" ||
        cliente === "diego34"
      ) {
        let c = this.contrataciones[this.contrataciones.length - 1];
        c.estado = "aceptada";
      }
    }
  }
}
