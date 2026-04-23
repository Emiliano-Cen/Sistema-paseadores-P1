/*
VAMOS A USAR ESTA VARIABLE PARA EL ID AUTO INCREMENTAL
DE USUARIOS
*/
let ultimoIDUsuario = 0;
let ultimoIDContratacion = 0;

class Usuario {
  /**
   *
   * @param {String} pNombre
   * @param {String} pPassword
   * @param {boolean} pEsPaseador
   * @param {String} pNombrePerro
   * @param {String} pTamanoPerro
   * 
   */
  constructor(pNombre, pPassword, pEsPaseador, pNombrePerro, pTamanoPerro) {
    this.id = ultimoIDUsuario++;
    this.nombre = pNombre;
    this.password = pPassword;
    this.esPaseador = pEsPaseador;
    this.nombrePerro = pNombrePerro;
    this.tamanoPerro = pTamanoPerro;
  }
}

class Paseador {
  /**
   *
   * @param {String} pNombrePaseador
   * @param {String} pPasswordPaseador
   * @param {String} pNombreCompletoPaseador
   * @param {boolean} pEsPaseador
   */
  constructor(pNombrePaseador, pPasswordPaseador, pEsPaseador, pNombreCompletoPaseador) {
    this.id = ultimoIDUsuario++;
    this.nombrePaseador = pNombrePaseador;
    this.passwordPaseador = pPasswordPaseador;
    this.esPaseador = pEsPaseador;
    this.nombreCompletoPaseador = pNombreCompletoPaseador;
  }
} 



class Contratacion {
  /**
   * 
   * @param {Usuario} cliente 
   * @param {Paseador} paseador 
   */
  constructor(pCliente, pPaseador) {
    this.id = ultimoIDContratacion++,
    this.cliente = pCliente;      
    this.paseador = pPaseador;     
    this.estado = "pendiente";    
  }
}