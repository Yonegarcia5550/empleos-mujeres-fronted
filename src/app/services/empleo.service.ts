import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleoService {

  private apiUrl = 'https://empleos-mujeres-backend-1.onrender.com/vacantes';

  constructor(private http: HttpClient) {}

  obtenerVacantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}