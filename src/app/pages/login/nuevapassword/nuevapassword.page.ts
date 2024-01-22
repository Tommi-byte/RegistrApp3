import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-nuevapassword',
  templateUrl: './nuevapassword.page.html',
  styleUrls: ['./nuevapassword.page.scss'],
})
export class NuevapasswordPage implements OnInit {

  showPassword !: boolean;
  uid: string = '';
  emailUser: string = '';
  dataUser: any;
  idToken: any;
  path: any;


  userAutenticado: any;

  usuario = {
    uid: '',
    email: '',
    password: '',
    name: '',
    type: '',
  }

  
  usuarioModificado = {
    uid: '',
    email: '',
    password: '',
    name: '',
    type: '',
  }

  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  activeRouter = inject(ActivatedRoute);
  firebaseService = inject(FirebaseService);
  utilidadesService = inject(UtilidadesService);

  ngOnInit() {
    this.activeRouter.params.subscribe(params => {
      this.uid = params['uid'];
      this.emailUser = params['userEmail'];
    });


  }

  async actualizarPassword() {

    const cargando = await this.utilidadesService.cargando();
    await cargando.present();

    if (this.form.valid) {
      this.dataUser = this.firebaseService.obtieneDatos(this.emailUser);
      this.dataUser.then(data => {
        this.usuario.password = data.password;
        this.usuario.email = data.email;
        this.usuario.uid = data.uid;
        this.usuario.name = data.name;
        this.usuario.type = data.type;

        this.usuarioModificado.password = this.form.value.password;
        this.usuarioModificado.email = data.email;
        this.usuarioModificado.uid = data.uid;
        this.usuarioModificado.name = data.name;
        this.usuarioModificado.type = data.type;

        this.firebaseService.autenticarUsuario(this.usuario as Usuario).then(async (res) => {
          await  this.firebaseService.actualizarContrasena(this.form.value.password).then( async (res) => {
            this.path = 'usuarios/' + this.usuario.email;
            await this.firebaseService.setDocument(this.path, this.usuarioModificado).then(() => {
              console.log('se modifico password dba');
              this.utilidadesService.presentAlert({
                message: 'Se cambio exitosamente la contraseña de su cuenta',
                buttons: [
                  {
                    text: 'Ok',
                    role: 'confirm',
                    cssClass: 'primary',
                    handler: () => {
                      this.utilidadesService.routerLink('/login');
                    },
                  },
                ]
              })
            })
          })
        }).catch(() => {
          this.utilidadesService.presentAlert({
            message: 'Error al obtener los datos del usuario',
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
        });

      }).finally(() => {
        cargando.dismiss();
      })
    }

    // this.dataUser.then(data => {
    //   this.passwordUser = data.password;
    //   this.usuario.email = this.emailUser;
    //   this.usuario.password = this.passwordUser;
    // })
    // this.usuarioAutenticado = this.firebaseService.autenticarUsuario(this.usuario);
    // console.log(this.firebaseService.actualizaPassword(this.usuarioAutenticado,this.form.value.password));
  }


  revela(): boolean {
    this.showPassword = !this.showPassword;
    return this.showPassword;
  }


}
