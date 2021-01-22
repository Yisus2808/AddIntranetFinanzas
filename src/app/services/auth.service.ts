import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.models';

import { map, delay } from 'rxjs/operators';
import { NewUsuarioModels } from '../models/newusuario.models';
import { PermisosModels } from '../models/permisos.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

// crear nuevo usuario
// https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

// Login
// https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'; // DESTINO DEL LOGIN, PARA AUTENTICARSE
  private apikey = 'AIzaSyAVJMMj1yofCVZRF7Od5iT63QCNJkZ7GL4'; // LA API PARA PODER LOGEARSE

  private bd = 'https://intranet-finanzas.firebaseio.com/'; //PARA LA BASE DE DATOWS
// https://intranet-finanzas.firebaseio.com/
// https://login-app-e2eb2.firebaseio.com/

  userToken: string;

  constructor( private http: HttpClient ) {

    this.leerToken();

  }

// ------------------- METODO PARA SALIR ---------------------
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
  }


// -------------------------------- METODO PARA LOGEARSE ----------------------------------
  login( usuario: UsuarioModel ) {

    const authData = {
      // email: usuario.email,
      // passwod: usuario.password,
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/verifyPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      // catchError -> sirve para atrapar el error // capitalizando resp['idToken']
      map( resp => {
        // console.log('Entro en el mapa del RXJS');
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  }


// ------------------------ CREARSE UN NUEVO USUARIO PARA LOGIN ------------------
  nuevoUsuario( usuario: UsuarioModel ) {

    const authData = {
      // email: usuario.email,
      // passwod: usuario.password,
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/signupNewUser?key=${ this.apikey }`,
      authData
    ).pipe(
      // catchError -> sirve para atrapar el error // capitalizando resp['idToken']
      map( resp => {
        // console.log('Entro en el mapa del RXJS');
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );
    // el map permite obtener la respuesta del metodo post
  }


// ------------------- METODO PARA GUARDAR EL TOKEN ----------------------
  private guardarToken( idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

// ----------------- METODO PARA LEER EL TOKEN ------------------------
  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }



// ----------------- METODO PARA DETERMINAR CUANDO EXPIRA EL TOKEN --------------------
  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira') );
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }




// ---------------------------------------------------- CON  BASE DE DATOS DE FIREBASE ----------------------------------------------------

// ------------- METODO PARA AGREGAR USUARIOS ---------------------
aggUsuario( usuario: NewUsuarioModels ) {

  // console.log(usuario);
  return this.http.post(`${ this.bd }/usuario.json`, usuario)
  .pipe(
    map( (resp: any) => {
      usuario.id = resp.nombre;
      return usuario;
    })
  );
}

// -------------- RESIVIENDO LOS USUARIOS --------------
getUsuarios() {
  return this.http.get(`${ this.bd }usuario.json`)
  .pipe(
    map( this.crearArreglo ),
    delay(500)
  );
}


// -------------- RESIVIENDO LOS PERMISOS ------------------
getPermisos() {
  return this.http.get(`${ this.bd }permisos.json`)
  .pipe(
    map( this.crearArreglo2 ),
    delay(500)
  );
}


// ----------- OBTENIENDO UN SOLO USUARIO ---------------------
getUsuario( id: string ) {
  return this.http.get(`${ this.bd }usuario/${ id }.json`);
}

// ------------ REQUERIEDO PARA BORRA LA ID QUE LE OTORGA FIREBASE POR DEFECTO -------------------
private crearArreglo( UsuariosObj: object ) {

  const usuarios: NewUsuarioModels[] = [];

  if ( UsuariosObj === null ) {
    return [];
  }

  Object.keys( UsuariosObj ).forEach( key => {
    const usuario: NewUsuarioModels = UsuariosObj[key];
    usuario.id = key;

    usuarios.push( usuario );
  });

  return usuarios;
}


// ------------ REQUERIEDO PARA BORRA LA ID QUE LE OTORGA FIREBASE POR DEFECTO -------------------
private crearArreglo2( PermisosObj: object ) {
  const permisos: PermisosModels[] = [];

  if ( PermisosObj === null ) {
    return [];
  }

  Object.keys( PermisosObj ).forEach( key => {
    const permiso: PermisosModels = PermisosObj[key];
    permiso.key = key;

    permisos.push( permiso );
  });

  return permisos;
}


// ------------ METODO PARA BORRAR UN USUARIO ----------------
borrarUsuario( id: string ) {
  return this.http.delete(`${ this.bd }usuario/${ id }.json`);
}


// -------------- METODO PARA EDITAR UN USUARIO ----------------------
editUsuario( usuario: NewUsuarioModels  ) {
  const usuarioTemp = {
    ...usuario
  };

  delete usuarioTemp.id;

  return this.http.put(`${ this.bd }usuario/${ usuario.id }.json`, usuarioTemp);
}


}
