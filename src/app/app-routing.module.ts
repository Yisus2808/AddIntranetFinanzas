import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
// import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';


import { AggUsuarioComponent } from './pages/agg-usuario/agg-usuario.component';
import { EditUsuarioComponent } from './pages/edit-usuario/edit-usuario.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent /*, canActivate: [ AuthGuard ]*/,
        children: [
          { path: 'aggUsuario', component:  AggUsuarioComponent /*, canActivate: [ AuthGuard ]*/ },
          { path: 'editUsuario', component: EditUsuarioComponent /*, canActivate: [ AuthGuard ]*/ },
          { path: '**', redirectTo: 'aggUsuario' }
         ]},
  // { path: 'registro', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  { path: '**', redirectTo: 'home' }
];
@NgModule({
  // , { useHash: true }
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
