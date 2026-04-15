import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  formulario = {
    nombre: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: 'buscadora'
  };

  cargando = false;
  error = '';
  intentoEnvio = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    this.intentoEnvio = true;
    this.error = '';

    if (
      !this.formulario.nombre.trim() ||
      !this.formulario.correo.trim() ||
      !this.formulario.password.trim() ||
      !this.formulario.confirmPassword.trim()
    ) {
      this.error = 'Completa los campos obligatorios';
      return;
    }

    if (this.formulario.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.formulario.password !== this.formulario.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;

    const payload = {
      nombre: this.formulario.nombre,
      correo: this.formulario.correo,
      telefono: this.formulario.telefono,
      password: this.formulario.password,
      rol: 'buscadora'
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.cargando = false;
        this.error = err.error?.mensaje || 'No se pudo registrar la usuaria';
      }
    });
  }
}