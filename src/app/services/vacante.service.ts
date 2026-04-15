import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {

 private apiUrl = 'https://empleos-mujeres-backend-1.onrender.com/vacantes';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // públicas
  obtenerVacantes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorColonia(colonia: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/buscar/colonia?colonia=${colonia}`
    );
  }

  obtenerVacantePorId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // empresa
  obtenerMisVacantes() {
    return this.http.get<any[]>(
      `${this.apiUrl}/empresa/mias`,
      this.getHeaders()
    );
  }

  crearVacante(data: any) {
    return this.http.post<any>(
      this.apiUrl,
      data,
      this.getHeaders()
    );
  }

  actualizarVacante(id: string, data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      data,
      this.getHeaders()
    );
  }

  eliminarVacante(id: string) {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }
  postularVacante(id: string) {
  return this.http.post(
    `${this.apiUrl}/${id}/postular`,
    {},
    this.getHeaders()
  );
}

  verPostulantes(id: string) {
  return this.http.get<any[]>(
    `${this.apiUrl}/${id}/postulantes`,
    this.getHeaders()
  );
}

}