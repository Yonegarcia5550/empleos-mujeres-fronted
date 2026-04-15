import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private apiUrl = 'https://empleos-mujeres-backend-1.onrender.com/postulaciones';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  crearPostulacion(data: any) {
    return this.http.post<any>(this.apiUrl, data, this.getHeaders());
  }

  obtenerMisPostulaciones() {
    return this.http.get<any[]>(`${this.apiUrl}/mias`, this.getHeaders());
  }

  obtenerPostulacionesPorVacante(vacanteId: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/vacante/${vacanteId}`,
      this.getHeaders()
    );
  }

  actualizarEstadoPostulacion(id: string, estado: string) {
    return this.http.put<any>(
      `${this.apiUrl}/${id}/estado`,
      { estado },
      this.getHeaders()
    );
  }
}