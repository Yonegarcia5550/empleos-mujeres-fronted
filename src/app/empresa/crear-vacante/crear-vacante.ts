import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacanteService } from '../../services/vacante.service';
import { MapaVacantesComponent } from '../../components/mapa-vacantes/mapa-vacantes';

@Component({
  selector: 'app-crear-vacante',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaVacantesComponent],
  templateUrl: './crear-vacante.html',
  styleUrls: ['./crear-vacante.css']

})
export class CrearVacanteComponent {
  form: any = {
    titulo: '',
    descripcion: '',
    ubicacion: '',
    salario: null,
    tipo: 'tiempo completo',
    lat: null,
    lng: null,
  };

  constructor(private vacanteService: VacanteService) {}

  onCoords(coords: { lat: number; lng: number }) {
    this.form.lat = coords.lat;
    this.form.lng = coords.lng;
  }

  crear() {
    if (this.form.lat == null || this.form.lng == null) {
      alert('Selecciona la ubicación en el mapa 💜');
      return;
    }

    this.vacanteService.obtenerVacantes().subscribe({
      next: () => alert('Vacante creada ✅'),
      error: (err) => alert(err?.error?.mensaje ?? 'Error al crear vacante')
    });
  }
}
