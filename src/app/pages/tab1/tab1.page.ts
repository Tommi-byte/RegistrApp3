import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AlertController, AnimationController, IonCard } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import type { Animation } from '@ionic/angular';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { BarcodeScanner, BarcodeFormat, LensFacing, Barcode } from '@capacitor-mlkit/barcode-scanning';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { Frase } from 'src/app/classes/frase';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  isSupported = false;
  barcodes: Barcode[] = [];
  ObjfraseDelDia : Frase[] = [];
  fraseDelDia: string;
  autorDelDia: string;
  numeroAleatorio: number;

  utilidadesService = inject(UtilidadesService);
  firebaseService = inject(FirebaseService);
  animationCtrl = inject(AnimationController);
  alertController = inject(AlertController);
  apiService = inject(ApiservicesService);

  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef<HTMLIonCardElement>;

  public animation!: Animation;
  usuario = this.utilidadesService.obtieneElementoLocalStorage('usuario');
  public saludo = this.obtenerSaludo();

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    console.log(this.getFraseDelDia());
  }

  generarNumeroAleatorio() {
    return this.numeroAleatorio = Math.floor(Math.random() * 20) + 1;
  }

  getFraseDelDia(){
    this.apiService.getFraseDelDia(this.generarNumeroAleatorio()).subscribe((data)=>{
      this.ObjfraseDelDia = data;
      this.fraseDelDia = this.ObjfraseDelDia[0].frase;
      this.autorDelDia = this.ObjfraseDelDia[0].autor;
    });
  }
  
  async startScan(){
    document.querySelector('body')?.classList.add('barcode-scanner-active');

    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async result => {
        console.log(result.barcode);
      },
    );
      
    // Start the barcode scanner
    await BarcodeScanner.startScan();
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngAfterViewInit() {
    const cardD = this.animationCtrl
      .create()
      .addElement(this.card.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo('background', 'lightblue', 'var(--background)');

    this.animation = this.animationCtrl
      .create()
      .duration(2000)
      .iterations(Infinity)
      .addAnimation([cardD]);

    this.animation.play();
  }

  obtenerSaludo(): string {
    const horaActual = new Date().getHours();

    let saludo: string;

    if (horaActual >= 5 && horaActual < 12) {
      saludo = '¡Buenos días!, ' + this.usuario.name;
    } else if (horaActual >= 12 && horaActual < 20) {
      saludo = '¡Buenas tardes!, ' + this.usuario.name;
    } else {
      saludo = '¡Buenas noches!, ' + this.usuario.name;
    }

    return saludo;
  }

}
