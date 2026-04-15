import { Component, OnInit,NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VacanteService } from '../services/vacante.service';
import { MapaVacantesComponent } from '../components/mapa-vacantes/mapa-vacantes';
import { PostulacionService } from '../services/postulacion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaVacantesComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vacantes: any[] = [];
  cargando = true;
  error = false;

  filtroTexto = '';
  filtroTipo = 'todos';
  intentoEnvio = false;

  userLat: number | null = null;
  userLng: number | null = null;
  radioMetros = 5000;

  vacanteActiva: any = null;
  vacanteSeleccionada: any = null;
  mostrarFormularioPostulacion = false;

  formularioPostulacion = {
    nombre: '',
    correo: '',
    telefono: '',
    experiencia: '',
    mensaje: ''
  };

  enviandoPostulacion = false;
  mensajeExito = '';

  constructor(
    private vacanteService: VacanteService,
    private postulacionService: PostulacionService,
    private router: Router,
    private ngZone: NgZone
   
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

  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    try {
      const usuario = JSON.parse(usuarioGuardado);
      this.formularioPostulacion.nombre = usuario.nombre || '';
      this.formularioPostulacion.correo = usuario.correo || '';
      this.formularioPostulacion.telefono = usuario.telefono || '';
    } catch (error) {
      console.error('Error al leer usuario de localStorage', error);
    }
  }

  this.obtenerVacantes();
}

  setUserLocation(coords: { lat: number; lng: number }) {
    this.userLat = coords.lat;
    this.userLng = coords.lng;
  }

  setVacanteActiva(v: any) {
    this.vacanteActiva = v;

    setTimeout(() => {
      const el = document.getElementById('card-' + v._id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }

  private distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const toRad = (x: number) => x * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  obtenerVacantes(): void {
    this.vacanteService.obtenerVacantes().subscribe({
      next: (data: any[]) => {
        this.vacantes = data;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      }
    });
  }

  get vacantesCercanas(): any[] {
    if (this.userLat == null || this.userLng == null) {
      return this.vacantes;
    }

    return this.vacantes
      .filter(v => v.lat && v.lng)
      .map(v => {
        const d = this.distanciaMetros(
          this.userLat!,
          this.userLng!,
          Number(v.lat),
          Number(v.lng)
        );
        return { ...v, distancia: d };
      })
      .filter(v => v.distancia <= this.radioMetros)
      .sort((a, b) => a.distancia - b.distancia);
  }

  get vacantesCercanasFiltradas(): any[] {
    const texto = this.filtroTexto.toLowerCase().trim();

    return this.vacantesCercanas.filter(v => {
      const textoOk =
        v.titulo?.toLowerCase().includes(texto) ||
        v.empresa?.nombre?.toLowerCase().includes(texto) ||
        v.ubicacion?.toLowerCase().includes(texto) ||
        v.colonia?.toLowerCase().includes(texto);

      const tipoOk =
        this.filtroTipo === 'todos' ||
        v.tipo?.toLowerCase() === this.filtroTipo;

      return textoOk && tipoOk;
    });
  }

  postular(id: string) {
    const vacante = this.vacantesCercanasFiltradas.find(v => v._id === id);

    if (!vacante) {
      alert('No se encontró la vacante');
      return;
    }

    this.vacanteSeleccionada = vacante;
    this.mostrarFormularioPostulacion = true;
  }

cerrarFormulario() {
  console.log('Cerrando formulario...');

  this.mostrarFormularioPostulacion = false;
  this.vacanteSeleccionada = null;
  this.enviandoPostulacion = false;

  this.formularioPostulacion = {
    nombre: this.formularioPostulacion.nombre,
    correo: this.formularioPostulacion.correo,
    telefono: this.formularioPostulacion.telefono,
    experiencia: '',
    mensaje: ''
  };

}

 enviarPostulacion() {
  if (!this.vacanteSeleccionada?._id) {
    alert('No se encontró la vacante');
    return;
  }

this.intentoEnvio = true;

if (
  !this.formularioPostulacion.nombre?.trim() ||
  !this.formularioPostulacion.correo?.trim() ||
  !this.formularioPostulacion.telefono?.trim()
) {
  return;
}

  const payload = {
    vacanteId: this.vacanteSeleccionada._id,
    nombre: this.formularioPostulacion.nombre,
    correo: this.formularioPostulacion.correo,
    telefono: this.formularioPostulacion.telefono,
    experiencia: this.formularioPostulacion.experiencia,
    mensaje: this.formularioPostulacion.mensaje
  };

  this.enviandoPostulacion = true;

  this.postulacionService.crearPostulacion(payload).subscribe({
    next: () => {
  this.mostrarFormularioPostulacion = false;
  this.vacanteSeleccionada = null;
  this.enviandoPostulacion = false;

  const usuarioGuardado = localStorage.getItem('usuario');
  let nombre = '';
  let correo = '';
  let telefono = '';

  if (usuarioGuardado) {
    try {
      const usuario = JSON.parse(usuarioGuardado);
      nombre = usuario.nombre || '';
      correo = usuario.correo || '';
      telefono = usuario.telefono || '';
    } catch {}
  }

  this.formularioPostulacion = {
    nombre,
    correo,
    telefono,
    experiencia: '',
    mensaje: ''
  };

  this.mensajeExito = 'Postulación enviada con éxito 💜';

  setTimeout(() => {
    this.mensajeExito = '';
  }, 3000);
},
    error: (error) => {
      this.enviandoPostulacion = false;
      console.error('Error al enviar postulación:', error);

      if (error.status === 400) {
        alert(error.error?.mensaje || 'Ya te postulaste a esta vacante');
      } else if (error.status === 401) {
        alert('Debes iniciar sesión para postularte');
      } else if (error.status === 403) {
        alert('Solo las buscadoras pueden postularse');
      } else {
        alert('Error al enviar la postulación');
      }
    }
  });
}

  buscar() {
    this.vacantes = [...this.vacantes];
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  
}