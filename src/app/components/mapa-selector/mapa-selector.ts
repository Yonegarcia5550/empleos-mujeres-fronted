import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-selector',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="mapSelector" class="map"></div>`,
  styles: [`
    .map { height: 420px; width: 100%; border-radius: 18px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
  `]
})
export class MapaSelectorComponent implements AfterViewInit {

  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number; lng: number }>();

  private map!: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    // Centro inicial (ajusta a tu ciudad)
    const centro: L.LatLngExpression = [17.065, -96.725];

    this.map = L.map('mapSelector').setView(centro, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Clic en el mapa -> crear/mover marcador y emitir coords
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;

      if (!this.marker) {
        this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
        this.marker.on('dragend', () => {
          const pos = this.marker!.getLatLng();
          this.coordenadasSeleccionadas.emit({ lat: pos.lat, lng: pos.lng });
        });
      } else {
        this.marker.setLatLng([lat, lng]);
      }

      this.coordenadasSeleccionadas.emit({ lat, lng });
    });
  }
}
