import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://empleos-mujeres-backend-1.onrender.com/auth';

  constructor(private http: HttpClient) {}

  login(correo: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      correo,
      password
    }).pipe(
      tap((res) => this.guardarSesion(res))
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.guardarSesion(res))
    );
  }

  guardarSesion(respuesta: any) {
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('rol', respuesta.usuario?.rol || '');
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario || {}));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  obtenerRol() {
    return localStorage.getItem('rol');
  }

  obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  estaLogueado() {
    return !!localStorage.getItem('token');
  }
}