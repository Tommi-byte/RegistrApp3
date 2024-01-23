import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable,of } from 'rxjs';
import { Frase } from '../classes/frase';
import { Asignatura } from '../classes/asignatura';


@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {

  url = "https://apifrasesdeldia.onrender.com/api";

  http = inject(HttpClient);

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  };

  getFraseDelDia(id: any): Observable<Frase[]> {
    return this.http.get<Frase[]>(`${this.url}/obtener-frase/` + id).pipe(
      tap((_) => console.log(`Frase fetched: ${id}`)),
      catchError(this.handleError<Frase[]>(`Get frase id=${id}`))
    );
  }

  
  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.url}/obtener-asignaturas`).pipe(
      tap((_) => console.log(`Se trajo asignaturas `)),
      catchError(this.handleError<Asignatura[]>(`Error traer asignaturas`))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }





}
