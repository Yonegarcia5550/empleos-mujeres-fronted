import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacanteService } from '../../services/vacante.service';
import { Router } from '@angular/router';
import { PostulacionService } from '../../services/postulacion.service';

@Component({
  selector: 'app-empresa-vacantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa-vacantes.html',
  styleUrls: ['./empresa-vacantes.css']
})
export class EmpresaVacantesComponent implements OnInit {
  vacantes: any[] = [];
  postulantesPorVacante: { [key: string]: any[] } = {};
  vacanteAbiertaPostulantes: string | null = null;
  postulacionesPorVacante: { [key: string]: any[] } = {};
  vacanteAbiertaSolicitudes: string | null = null;
  cargandoSolicitudes: { [key: string]: boolean } = {};


  editando = false;
  vacanteEditandoId: string | null = null;

  formulario = {
    titulo: '',
    descripcion: '',
    ubicacion: '',
    salario: null as number | null,
    tipo: 'tiempo completo',
    lat: null as number | null,
    lng: null as number | null,
    telefono: '',
    direccionCompleta: ''
  };

constructor(
  private vacanteService: VacanteService,
  private router: Router,
  private cdr: ChangeDetectorRef,
  private postulacionService: PostulacionService

) {}

ngOnInit(): void {
  console.log('ENTRANDO A EMPRESA');
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    this.router.navigate(['/login']);
    return;
  }

  if (rol !== 'empresa') {
    this.router.navigate(['/home']);
    return;
  }

  this.resetFormulario();
  this.cargarMisVacantes();
}
cargarMisVacantes() {
  console.log('CARGANDO MIS VACANTES...');

  this.vacanteService.obtenerMisVacantes().subscribe({
    next: (data: any) => {
      console.log('VACANTES RECIBIDAS RAW:', data);
      console.log('Array.isArray(data):', Array.isArray(data));
      console.log('typeof data:', typeof data);
      console.log('data?.length:', data?.length);
      console.log('Object.keys(data):', Object.keys(data || {}));

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.vacantes)
          ? data.vacantes
          : Object.values(data || {});

      console.log('LISTA FINAL:', lista);

      this.vacantes = [...lista];
      console.log('VACANTES ASIGNADAS:', this.vacantes);

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al cargar vacantes:', err);
      alert('No se pudieron cargar tus vacantes');
    }
  });
}

  guardarVacante() {
    if (
      !this.formulario.titulo ||
      !this.formulario.descripcion ||
      !this.formulario.ubicacion ||
      this.formulario.salario == null ||
      this.formulario.lat == null ||
      this.formulario.lng == null
    ) {
      alert('Completa los campos obligatorios');
      return;
    }

    if (this.editando && this.vacanteEditandoId) {
      this.vacanteService.actualizarVacante(this.vacanteEditandoId, this.formulario).subscribe({
        next: () => {
          alert('Vacante actualizada ✅');
          this.resetFormulario();
          this.cargarMisVacantes();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar vacante');
        }
      });
    } else {
      this.vacanteService.crearVacante(this.formulario).subscribe({
        next: () => {
          alert('Vacante creada ✅');
          this.resetFormulario();
          this.cargarMisVacantes();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear vacante');
        }
      });
    }
  }

  editarVacante(v: any) {
    this.editando = true;
    this.vacanteEditandoId = v._id;

    this.formulario = {
      titulo: v.titulo || '',
      descripcion: v.descripcion || '',
      ubicacion: v.ubicacion || '',
      salario: v.salario ?? null,
      tipo: v.tipo || 'tiempo completo',
      lat: v.lat ?? null,
      lng: v.lng ?? null,
      telefono: v.telefono || '',
      direccionCompleta: v.direccionCompleta || ''
    };
  }

  eliminarVacante(id: string) {
    const confirmado = confirm('¿Seguro que deseas eliminar esta vacante?');
    if (!confirmado) return;

    this.vacanteService.eliminarVacante(id).subscribe({
      next: () => {
        alert('Vacante eliminada ✅');
        this.cargarMisVacantes();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar vacante');
      }
    });
  }

  verPostulantes(idVacante: string) {
    if (this.vacanteAbiertaPostulantes === idVacante) {
      this.vacanteAbiertaPostulantes = null;
      return;
    }

    this.vacanteService.verPostulantes(idVacante).subscribe({
      next: (data) => {
        this.postulantesPorVacante[idVacante] = data;
        this.vacanteAbiertaPostulantes = idVacante;
      },
      error: (err) => {
        console.error('Error al ver postulantes:', err);
        alert('No se pudieron cargar los postulantes');
      }
    });
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  resetFormulario() {
    this.editando = false;
    this.vacanteEditandoId = null;

    this.formulario = {
      titulo: '',
      descripcion: '',
      ubicacion: '',
      salario: null,
      tipo: 'tiempo completo',
      lat: null,
      lng: null,
      telefono: '',
      direccionCompleta: ''
    };
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

verSolicitudes(vacanteId: string) {
  // Si ya está abierta, solo cerrar
  if (this.vacanteAbiertaSolicitudes === vacanteId) {
    this.vacanteAbiertaSolicitudes = null;
    return;
  }

  // Abrir inmediatamente la vacante seleccionada
  this.vacanteAbiertaSolicitudes = vacanteId;

  // Si ya están cargadas, no volver a pedir
  if (this.postulacionesPorVacante[vacanteId]) {
    return;
  }

  // Marcar carga
  this.cargandoSolicitudes[vacanteId] = true;

  this.postulacionService.obtenerPostulacionesPorVacante(vacanteId).subscribe({
    next: (data) => {
      this.postulacionesPorVacante[vacanteId] = data;
      this.cargandoSolicitudes[vacanteId] = false;
    },
    error: (err) => {
      console.error('Error al cargar solicitudes:', err);
      this.cargandoSolicitudes[vacanteId] = false;
      alert('No se pudieron cargar las solicitudes');
    }
  });
}

cambiarEstado(postulacionId: string, estado: string, vacanteId: string) {
  this.postulacionService.actualizarEstadoPostulacion(postulacionId, estado).subscribe({
    next: () => {
      alert('Estado actualizado ✅');

      this.postulacionService.obtenerPostulacionesPorVacante(vacanteId).subscribe({
        next: (data) => {
          this.postulacionesPorVacante[vacanteId] = data;
        },
        error: (err) => {
          console.error('Error al recargar solicitudes:', err);
        }
      });
    },
    error: (err) => {
      console.error('Error al actualizar estado:', err);
      alert('No se pudo actualizar el estado');
    }
  });
}
}