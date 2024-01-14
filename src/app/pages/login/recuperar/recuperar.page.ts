import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  firebaseService = inject(FirebaseService);
  utilidadesService = inject(UtilidadesService);

  ngOnInit() {
  }


  async recuperarPassword() {
    if(this.form.valid){

      const cargando = await this.utilidadesService.cargando();
      await cargando.present();

      this.firebaseService.recuperarPassword(this.form.value.email).then( res => {
        this.utilidadesService.presentAlert({
          header: 'Correo Enviado',
          message: 'Le hemos enviado un correo para recuperar su password',
          buttons : [
            {
              text: 'Ok',
              role: 'confirm',
              cssClass: 'primary',
              handler: () => {
                this.form.reset();
                this.utilidadesService.routerLink('/login');
              },
            },
          ]
        })
      }).catch(error => {
        this.utilidadesService.presentAlert({
          message: 'Error al recuperar su password',
          buttons : [
            {
              text: 'Ok',
              role: 'cancel',
              cssClass: 'primary',
              handler: () => {
                console.log('Acción cancelada');
              },
            },
          ]
        })

      }).finally( () => {
        cargando.dismiss();
      })
    }
  }


}
