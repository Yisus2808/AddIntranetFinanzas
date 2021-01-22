import { Component, OnInit } from '@angular/core';

import { NewUsuarioModels } from 'src/app/models/newusuario.models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { PermisosModels } from 'src/app/models/permisos.models';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent implements OnInit {

  permisos: PermisosModels[] = [];

  usuario: NewUsuarioModels = new NewUsuarioModels();
  usuarios: NewUsuarioModels[] = [];
  id: string;

  buscando: string;
  search = false;

  cargando = false;

  constructor( private authService: AuthService ) { }

  ngOnInit() {

    // Obtiene los usuarios que se muestran en la tabla
    this.cargando = true;
    this.authService.getUsuarios()
    .subscribe( resp => {
      // console.log(resp);
      this.usuarios = resp;
      this.cargando = false;
    });

    // Obtiene los permisos que se muetran en el mnodal
    this.authService.getPermisos()
    .subscribe( resp => {
      this.permisos = resp;
    });

  }

  actualizarUsr( id: string ) {
    // console.log(id);
    this.id = id;
    this.authService.getUsuario( id )
    .subscribe( (resp: NewUsuarioModels) => {
      this.usuario = resp;
      console.log('Se obtienen los datos del usuario seleccionado');
    });

  }

  guardar( form: NgForm ) {
    this.usuario.id = this.id;

    if ( form.invalid ) {
      Swal.fire({
        title: '¡ UPS !',
        text: 'Todos los campos son obligatorios',
        type: 'error'
      });
      console.log('Campos no completados');
      return;
    }

    console.log('Se obtienen los datos actiualizados del formulario');

    // console.log(this.usuario);
    this.authService.editUsuario( this.usuario )
    .subscribe( () => {

      Swal.fire({
        title: this.usuario.nombre,
        text: 'Se actualizo correctamente',
        type: 'success'
      }).then((result) => {
        if (result.value) {
          return;
        } else {
          Swal.fire({
            title: 'ERROR',
            text: 'Ocurrio un error al actualizar el usuario',
            type: 'error'
          });
        }
      });
      this.ngOnInit();

    });

  }

  borrarUsuario( usuario: NewUsuarioModels, i: number ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Está seguro que desea eliminar a ${ usuario.nombre }`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {

      if (result.value) {

        this.usuarios.splice( i, 1);
        this.authService.borrarUsuario( usuario.id ).subscribe();
        swalWithBootstrapButtons.fire(
          '¡ Eliminado !',
          'Se elimino el usuario correctamente',
          'success'
        );

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El usuario no a sido eliminado',
          'error'
        );
      }
    });

  }


  buscar( termino: string ) {

    console.log(termino);
    this.buscando = termino;

    if ( this.buscando.length > 0 ) {

      this.search = true;

    } else {

      this.search = false;

    }

    // console.log(id);
    // this.buscando = termino;
    // this.search = true;
    // this.authService.getUsuario( termino )
    // .subscribe( (resp: NewUsuarioModels) => {
    //   // this.usuario = resp;
    //   console.log(resp);
    //   this.search = false;
    // });


  }

}
