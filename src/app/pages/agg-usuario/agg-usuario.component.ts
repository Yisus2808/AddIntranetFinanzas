import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { NewUsuarioModels } from 'src/app/models/newusuario.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { PermisosModels } from 'src/app/models/permisos.models';

@Component({
  selector: 'app-agg-usuario',
  templateUrl: './agg-usuario.component.html',
  styleUrls: ['./agg-usuario.component.css']
})
export class AggUsuarioComponent implements OnInit {

  // permisos: any = [
  //   { id: 1, perfil: 'Admin', descripcion: 'Admin del sistema'},
  //   { id: 2, perfil: 'Mod', descripcion: 'Mod del sistema'},
  //   { id: 3, perfil: 'Stuar', descripcion: 'Stuar del sistema'}
  // ];
  permisos: PermisosModels[] = [];

  usuario: NewUsuarioModels = new NewUsuarioModels();

  pk = false;
  posicion: number;
  cargando = false;

  passType = 'password';
  passShow = false;

  mostrarContrasena() {

    if ( this.passShow ) {
        this.passType = 'password';
        this.passShow = false;
    } else {
        this.passType = 'text';
        this.passShow = true;
    }

  }

  idTable( permiso: number ) {

    // console.log(permiso);
    this.usuario.permiso = permiso;
    this.posicion = permiso;

  }


  constructor( private usuariosService: AuthService ) {

  }

  ngOnInit() {

    this.cargando = true;
    this.usuariosService.getPermisos()
    .subscribe( resp => {
      this.permisos = resp;
      this.cargando = false;
    });

  }

  guardar( form: NgForm ) {
    if ( form.invalid ) {
      Swal.fire({
        title: '¡ ERROR !',
        text: 'Todos los campos son obligatorios',
        type: 'error'
      });
      console.log('Form invalid');
      return;
    }

    // console.log(form);
    // console.log(this.usuario);

    Swal.fire({
      title: 'Espere',
      text: 'Guardando la información',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    if ( this.pk ) {
      // console.log( this.usuario );
      this.usuariosService.aggUsuario( this.usuario )
      .subscribe( () => {

        Swal.fire({
          title: this.usuario.nombre,
          text: 'Fue agregado correctamente',
          type: 'success'
        });
        this.usuario = new NewUsuarioModels();
        this.pk = false;

      });
    } else {
      Swal.fire({
        title: '¡ UPS !',
        text: 'Debe otorgar un permiso',
        type: 'info'
      });
    }

    // this.usuariosService.aggUsuario( this.usuario );
  }


}
