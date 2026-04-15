import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css']
})
export class AdminPanelComponent implements OnInit {
  empresas: any[] = [];
  vacantes: any[] = [];

constructor(
  private adminService: AdminService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (rol !== 'superusuario') {
      this.router.navigate(['/home']);
      return;
    }

    this.cargarEmpresas();
    this.cargarVacantes();
  }

cargarEmpresas() {
  this.adminService.obtenerEmpresas().subscribe({
    next: (data: any[]) => {
      console.log('EMPRESAS RECIBIDAS:', data);
      this.empresas = [...data];
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al cargar empresas:', err);
    }
  });
}

cargarVacantes() {
  this.adminService.obtenerVacantes().subscribe({
    next: (data: any[]) => {
      console.log('VACANTES RECIBIDAS ADMIN:', data);
      this.vacantes = [...data];
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al cargar vacantes:', err);
    }
  });
}

  aprobarEmpresa(id: string) {
    this.adminService.aprobarEmpresa(id).subscribe({
      next: () => {
        alert('Empresa aprobada ✅');
        this.cargarEmpresas();
      },
      error: (err) => {
        console.error(err);
        alert('Error al aprobar empresa');
      }
    });
  }

  rechazarEmpresa(id: string) {
    this.adminService.rechazarEmpresa(id).subscribe({
      next: () => {
        alert('Empresa rechazada ✅');
        this.cargarEmpresas();
      },
      error: (err) => {
        console.error(err);
        alert('Error al rechazar empresa');
      }
    });
  }

  eliminarVacante(id: string) {
    const confirmado = confirm('¿Seguro que deseas eliminar esta vacante?');

    if (!confirmado) return;

    this.adminService.eliminarVacante(id).subscribe({
      next: () => {
        alert('Vacante eliminada ✅');
        this.cargarVacantes();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar vacante');
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}