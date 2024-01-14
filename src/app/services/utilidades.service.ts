import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  cargandoSpinner = inject(LoadingController);
  toastController = inject(ToastController);
  alertController = inject(AlertController);
  router = inject(Router);

  cargando() {
    return this.cargandoSpinner.create({ spinner: 'lines-sharp-small' })
  }

  async presentToast(opciones?: ToastOptions) {
    const toast = await this.toastController.create(opciones);
    toast.present();
  }

  async presentAlert(opciones?: AlertOptions) {
    const alert = await this.alertController.create(opciones);
    await alert.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // LocalStorage 
  guardaEnLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  obtieneElementoLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

}
