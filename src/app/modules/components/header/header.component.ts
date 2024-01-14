import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  isModalOpen = false;

  
  firebaseService = inject(FirebaseService);
  utilidadesService = inject(UtilidadesService);

  ngOnInit() {}

  cerrarSesion() {
    this.utilidadesService.presentAlert({
      header: "Cerrar Sesión",
      message: "¿Estas seguro?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Acción cancelada');
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.firebaseService.cerrarSesion();
          },
        },
      ],
    })
  }
  
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

}
