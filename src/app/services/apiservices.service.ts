import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable,of } from 'rxjs';
import { Frase } from '../classes/frase';
import { Asignatura } from '../classes/asignatura';
import { Asistencia } from '../classes/asistencia';
import { Inscripciones } from '../classes/inscripciones';


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

  
  // API ASISTENCIAS
  getInscripciones(uid : any): Observable<Inscripciones[]> {
    return this.http.get<Inscripciones[]>(`${this.url}/obtener-inscripciones/${uid}`).pipe(
      tap((_) => console.log(`Se trajo asignaturas `)),
      catchError(this.handleError<Inscripciones[]>(`Error traer asignaturas`))
    );
  }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.url}/obtener-asignaturas`).pipe(
      tap((_) => console.log(`Se trajo asignaturas `)),
      catchError(this.handleError<Asignatura[]>(`Error traer asignaturas`))
    );
  }

  getDetalleAsignatura(id : any): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.url}/obtener-detalle-asignatura/${id}`).pipe(
      tap((_) => console.log(`Se trajo la asignatura `)),
      catchError(this.handleError<Asignatura[]>(`Error traer la asignatura`))
    );
  }

  postAsistencia(dataAsistencia : any){
    return this.http.post<Asistencia[]>(`${this.url}/agregar-asistencia`, dataAsistencia).pipe(
      tap((_) => console.log('Se inserto la asistencia')),
      catchError(this.handleError<Asistencia[]>(`Error al insertar asistencia`))
    )
  }

  // getAsistenciaAlumno(uid : any, idAsignatura : any): Observable<Asistencia[]> {
  //   return this.http.get<Asistencia[]>(`${this.url}/obtener-asistencia/${uid}`).pipe(
  //     tap((_) => console.log(`Se trajo la asitencia del alumno `)),
  //     catchError(this.handleError<Asistencia[]>(`Error traer la asitencia del alumno `))
  //   );
  // }

  getAsistenciaAlumno(uid: any, idAsignatura: any): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.url}/obtener-asistencia/${uid}/${idAsignatura}`).pipe(
        tap((_) => console.log(`Se trajo la asistencia del alumno`)),
        catchError(this.handleError<Asistencia[]>(`Error al traer la asistencia del alumno`))
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
