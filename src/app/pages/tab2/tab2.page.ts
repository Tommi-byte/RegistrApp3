import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public uid: string;
  public usuario: any;
  public asistencias: any;
  public inscripciones: any;
  public detallesAsignaturas = [];
  public detallesAsistencia = [];

  apiService = inject(ApiservicesService);
  firebaseService = inject(FirebaseService);
  utilidadesService = inject(UtilidadesService);


  constructor() {
    this.getInscripciones();
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.detallesAsignaturas = [];
      this.getInscripciones();
      event.target.complete();
    }, 2000);
  }

  async getInscripciones() {
    const cargando = await this.utilidadesService.cargando();
    await cargando.present();

    try {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));

      const datosUsuario = this.firebaseService.obtieneDatos(this.usuario.email);
      const inscripciones = this.apiService.getInscripciones(this.usuario.uid);

      forkJoin([datosUsuario, inscripciones]).subscribe(
        ([resUsuario, resInscripciones]) => {
          this.uid = resUsuario.uid;
          this.inscripciones = resInscripciones;

          this.inscripciones.forEach(inscripcion => {
            const idAsignatura = inscripcion['asignatura_id'];

            this.apiService.getDetalleAsignatura(idAsignatura).subscribe((data) => {
              this.apiService.getAsistenciaAlumno(this.uid, idAsignatura).subscribe((dataAsistencia) => {

                // Verifica si data es un arreglo o una asignatura única
                if (Array.isArray(data)) {
                  // Si es un arreglo, itera sobre cada asignatura
                  data.forEach(asignatura => asignatura.asistencia = dataAsistencia);
                } else {
                  // Si es una asignatura única, asigna la propiedad asistencia directamente
                }
                this.detallesAsignaturas.push(data);
              })

            });
          });


        },
        error => {
          console.log(error);
          this.utilidadesService.presentAlert({
            header: 'Error',
            message: 'No fue posible traer las asignaturas',
            buttons: [
              {
                text: 'Ok',
                role: 'confirm',
                cssClass: 'primary',
                handler: () => {
                  console.log('Acción cancelada');
                },
              },
            ],
          });
        },
        () => {
          cargando.dismiss();
        }
      );
    } catch (error) {
      console.error(error);
      cargando.dismiss();
    }
  }

  // async getInscripciones(){

  //   const cargando = await this.utilidadesService.cargando();
  //   await cargando.present();

  //   this.usuario = JSON.parse(localStorage.getItem('usuario'));
  //   this.firebaseService.obtieneDatos(this.usuario.email).then( res => {
  //     this.uid = res.uid;
  //     this.apiService.getInscripciones(this.uid).subscribe((data) => {
  //       this.inscripciones = data;
  //       const idAsignatura = this.inscripciones[0]['asignatura_id'];
  //       console.log('este es el id del ramo:',idAsignatura);
  //       this.apiService.getDetalleAsignatura(idAsignatura).subscribe((data) => {
  //         this.detallesAsignaturas = data;
  //       })
  //     });
  //   }).catch( error => {
  //     console.log(error);
  //     this.utilidadesService.presentAlert({
  //       header: 'Error',
  //       message: 'No fue posible traer la asignaturas',
  //       buttons : [
  //         {
  //           text: 'Ok',
  //           role: 'confirm',
  //           cssClass: 'primary',
  //           handler: () => {
  //             console.log('Acción cancelada');
  //           },
  //         }
  //       ]
  //     })
  //   }).finally( () => {
  //     cargando.dismiss();
  //   })
  // }


  // async getAsistenciaEstudiante() {

  //   const cargando = await this.utilidadesService.cargando();
  //   await cargando.present();

  //   this.usuario = JSON.parse(localStorage.getItem('usuario'));
  //   this.firebaseService.obtieneDatos(this.usuario.email).then(res => {
  //     this.uid = res.uid;
  //     this.apiService.getAsistenciaAlumno(this.uid).subscribe((data) => {
  //       this.asistencias = data;
  //     });
  //   }).catch(error => {
  //     console.log(error);
  //     this.utilidadesService.presentAlert({
  //       header: 'Error',
  //       message: 'No fue posible traer los datos de la asistencia',
  //       buttons: [
  //         {
  //           text: 'Ok',
  //           role: 'confirm',
  //           cssClass: 'primary',
  //           handler: () => {
  //             console.log('Acción cancelada');
  //           },
  //         }
  //       ]
  //     })
  //   }).finally(() => {
  //     cargando.dismiss();
  //   })
  // }

}
