import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostulacionService } from '../services/postulacion.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-mis-postulaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-postulaciones.html',
  styleUrls: ['./mis-postulaciones.css']
})
export class MisPostulacionesComponent implements OnInit {
  postulaciones: any[] = [];
  cargando = true;
  error = false;

  constructor(
    private postulacionService: PostulacionService,
    private router: Router,
     private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (rol !== 'buscadora') {
      this.router.navigate(['/empresa']);
      return;
    }

    this.cargarPostulaciones();
  }

cargarPostulaciones() {
  this.cargando = true;
  this.error = false;

  this.postulacionService.obtenerMisPostulaciones().subscribe({
    next: (data: any) => {
      console.log('POSTULACIONES OK:', data);

      this.postulaciones = data;
      this.cargando = false;
      this.error = false;

      this.cd.detectChanges();

      console.log('CARGANDO DESPUÉS:', this.cargando);
      console.log('LONGITUD POSTULACIONES:', this.postulaciones.length);
    },
    error: (err) => {
      console.error('Error al cargar postulaciones:', err);

      this.error = true;
      this.cargando = false;

      this.cd.detectChanges();
    }
  });
}

  volver() {
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'enviada':
        return 'estado-enviada';
      case 'revisada':
        return 'estado-revisada';
      case 'aceptada':
        return 'estado-aceptada';
      case 'rechazada':
        return 'estado-rechazada';
      default:
        return '';
    }
  }
}