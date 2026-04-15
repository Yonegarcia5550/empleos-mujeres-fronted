import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register';
import { EmpresaVacantesComponent } from './empresa/empresa-vacantes/empresa-vacantes';
import { MisPostulacionesComponent } from './mis-postulaciones/mis-postulaciones';
import { AdminPanelComponent } from './admin-panel/admin-panel';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'empresa', component: EmpresaVacantesComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'mis-postulaciones', component: MisPostulacionesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];