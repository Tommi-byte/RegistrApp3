import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit {

  asignaturas : any;
  qrData : string;
  nombreUsuario: string;
  public saludo = this.obtenerSaludo();
  
  form = new FormGroup({
    asignatura: new FormControl('', [Validators.required]),
  })

  constructor(private apiService : ApiservicesService) { 
  }

  ngOnInit() {
    this.getAsignaturas();
  }

  getAsignaturas() {
    this.apiService.getAsignaturas().subscribe((data) => {
      this.asignaturas = data;
    });
  }

  obtenerSaludo(): string {
    const horaActual = new Date().getHours();
    var usuario = JSON.parse(localStorage.getItem('usuario'));

    let saludo: string;

    if (horaActual >= 5 && horaActual < 12) {
      saludo = '¡Buenos días!, ' + usuario.name;
    } else if (horaActual >= 12 && horaActual < 20) {
      saludo = '¡Buenas tardes!, ' + usuario.name;
    } else {
      saludo = '¡Buenas noches!, ' + usuario.name;
    }

    return saludo;
  }

}
