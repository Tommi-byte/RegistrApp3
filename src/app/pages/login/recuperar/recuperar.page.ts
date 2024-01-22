import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { environment } from 'src/environments/environment.prod';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { AngularFireModule } from '@angular/fire/compat';


@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  dataUser: any;
  userName: any;
  uidUser = '';
  messageEmail : any;

  templateParams = {
    name: '',
    email: '',
    message: '',
  };

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  firebaseService = inject(FirebaseService);
  utilidadesService = inject(UtilidadesService);

  ngOnInit() {
  }

  publicKey = environment.keyEmailJS;
  serviceId = environment.serviceId;
  templateId = environment.templateId;


  async enviaEmail(e: Event) {

    if (this.form.valid) {
      const cargando = await this.utilidadesService.cargando();
      await cargando.present();
      this.dataUser = this.firebaseService.obtieneDatos(this.form.value.email);
      this.dataUser.then(data => {
        this.templateParams.email = data.email;
        this.templateParams.name = data.name;
        this.uidUser = data.uid;
        this.messageEmail = 'Haga click en el siguiente enlace para recuperar su contraseña: http://localhost:8100/login/nuevapassword/' +  this.uidUser + '/' +  data.email ;
        this.templateParams.message = this.messageEmail;
        console.log(this.templateParams.message)

        console.log(this.templateParams.email.length);

        if (this.templateParams.email.length == 0) {
          this.utilidadesService.presentAlert({
            header: 'Usuario no encontrado',
            message: 'No fue posible encontrar un usuario con ese email',
            buttons: [
              {
                text: 'Ok',
                role: 'confirm',
                cssClass: 'primary',
                handler: () => {
                  this.form.reset();
                },
              },
            ]
          })
          cargando.dismiss();
        } else {
          emailjs.send(this.serviceId, this.templateId, this.templateParams, this.publicKey)
            .then((result: EmailJSResponseStatus) => {
              console.log(result.text);
              this.utilidadesService.presentAlert({
                header: 'Correo Enviado',
                message: 'Le hemos enviado un correo para recuperar su password',
                buttons: [
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
                buttons: [
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

            }).finally(() => {
              cargando.dismiss();
            });
        }

      })
    }
  }

  // async recuperarPassword() {
  //   if (this.form.valid) {

  //     const cargando = await this.utilidadesService.cargando();
  //     await cargando.present();

  //     this.firebaseService.recuperarPassword(this.form.value.email).then(res => {
  //       this.utilidadesService.presentAlert({
  //         header: 'Correo Enviado',
  //         message: 'Le hemos enviado un correo para recuperar su password',
  //         buttons: [
  //           {
  //             text: 'Ok',
  //             role: 'confirm',
  //             cssClass: 'primary',
  //             handler: () => {
  //               this.form.reset();
  //               this.utilidadesService.routerLink('/login');
  //             },
  //           },
  //         ]
  //       })
  //     }).catch(error => {
  //       this.utilidadesService.presentAlert({
  //         message: 'Error al recuperar su password',
  //         buttons: [
  //           {
  //             text: 'Ok',
  //             role: 'cancel',
  //             cssClass: 'primary',
  //             handler: () => {
  //               console.log('Acción cancelada');
  //             },
  //           },
  //         ]
  //       })

  //     }).finally(() => {
  //       cargando.dismiss();
  //     })
  //   }
  // }


}
