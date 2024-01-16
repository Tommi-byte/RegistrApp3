import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showPassword !: boolean;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  firebaseService = inject(FirebaseService);
  utilidadesService = inject(UtilidadesService);

  ngOnInit() {
  }

  revela(): boolean {
    this.showPassword = !this.showPassword;
    return this.showPassword;
  }

  async iniciarSesion() {
    if(this.form.valid){

      const cargando = await this.utilidadesService.cargando();
      await cargando.present();

      this.firebaseService.autenticarUsuario(this.form.value as Usuario).then( res => {
        this.obtieneDatosUsuario(res.user.uid);
      }).catch(error => {

        this.utilidadesService.presentAlert({
          message: 'Email o password no válido',
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

  async obtieneDatosUsuario(uid: string) {
    if(this.form.valid){

      const cargando = await this.utilidadesService.cargando();
      await cargando.present();

      let path = `usuarios/${uid}`

      this.firebaseService.selectRegistro(path).then( usuario => {
       
        this.utilidadesService.guardaEnLocalStorage('usuario', usuario);
        this.utilidadesService.routerLink("/tabs/tab1");
        this.form.reset();

        this.utilidadesService.presentToast({
          message: 'Inicio de sesión exitoso, datos del usuario cargado',
          duration: 2500,
          position: 'bottom',
          icon: 'alert-circle-outline',
          color: 'success'
        })

      }).catch(error => {
        this.utilidadesService.presentAlert({
          message: 'Error al obtener los datos del usuario',
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
