import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://empleos-mujeres-backend-1.onrender.com/admin';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  obtenerEmpresas() {
    return this.http.get<any[]>(`${this.apiUrl}/empresas`, this.getHeaders());
  }

  aprobarEmpresa(id: string) {
    return this.http.put<any>(`${this.apiUrl}/empresas/${id}/aprobar`, {}, this.getHeaders());
  }

  rechazarEmpresa(id: string) {
    return this.http.put<any>(`${this.apiUrl}/empresas/${id}/rechazar`, {}, this.getHeaders());
  }

  obtenerVacantes() {
    return this.http.get<any[]>(`${this.apiUrl}/vacantes`, this.getHeaders());
  }

  eliminarVacante(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/vacantes/${id}`, this.getHeaders());
  }
}