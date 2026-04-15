import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

login() {
  this.authService.login(this.correo, this.password).subscribe({
    next: (res) => {
      const rol = res.usuario?.rol;

      if (rol === 'superusuario') {
        this.router.navigate(['/admin']);
      } else if (rol === 'empresa') {
        this.router.navigate(['/empresa']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      console.error(err);

      if (err.status === 0) {
        alert('Servidor caído');
      } else if (err.status === 401 || err.status === 404) {
        alert('Credenciales incorrectas');
      } else {
        alert('Error al iniciar sesión');
      }
    }
  });
}
}