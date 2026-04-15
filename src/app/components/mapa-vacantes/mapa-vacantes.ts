import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-vacantes',
  standalone: true,
  imports: [CommonModule],
  template: `<div #mapContainer class="map"></div>`,
  styles: [`
    .map {
      height: 420px;
      width: 100%;
      border-radius: 18px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    }
  `]
})
export class MapaVacantesComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() vacantes: any[] = [];

  @Output() ubicacionUsuario = new EventEmitter<{ lat: number; lng: number }>();
  @Output() vacanteSeleccionada = new EventEmitter<any>();

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markers = L.layerGroup();
  private userMarker?: L.Marker;
  private mapReady = false;

  ngAfterViewInit(): void {
    if (!this.mapContainer?.nativeElement) return;

    this.map = L.map(this.mapContainer.nativeElement).setView([17.065, -96.725], 13);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap'
      }
    ).addTo(this.map);

    this.markers.addTo(this.map);
    this.mapReady = true;

    setTimeout(() => {
      if (!this.map) return;
      this.map.invalidateSize();
      this.locateUser();
      this.renderMarkers();
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vacantes'] && this.mapReady) {
      this.renderMarkers();
    }
  }

  ngOnDestroy(): void {
    this.markers.clearLayers();

    if (this.userMarker && this.map) {
      this.map.removeLayer(this.userMarker);
    }

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    this.mapReady = false;
  }

  private locateUser(): void {
    if (!navigator.geolocation || !this.map) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!this.map) return;

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        this.ubicacionUsuario.emit({ lat, lng });

        const coords: L.LatLngExpression = [lat, lng];
        this.map.setView(coords, 14);

        if (this.userMarker) {
          this.map.removeLayer(this.userMarker);
        }

        this.userMarker = L.marker(coords)
          .bindPopup('📍 Tu ubicación')
          .addTo(this.map);
      },
      (error) => {
        console.warn('No se pudo obtener la ubicación del usuario:', error);
      }
    );
  }

  private renderMarkers(): void {
    if (!this.map || !this.mapReady) return;

    this.markers.clearLayers();

    const conCoords = this.vacantes.filter(v => v.lat != null && v.lng != null);

    if (conCoords.length === 0) return;

    conCoords.forEach(v => {
      const lat = Number(v.lat);
      const lng = Number(v.lng);

      if (isNaN(lat) || isNaN(lng)) return;

      L.marker([lat, lng])
        .bindPopup(`
          <b>${v.titulo ?? 'Vacante'}</b><br/>
          ${v.colonia ?? ''}
        `)
        .on('click', () => {
          this.vacanteSeleccionada.emit(v);
        })
        .addTo(this.markers);
    });
  }
}