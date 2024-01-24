import { Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { AlertController, AnimationController, IonCard } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import type { Animation } from '@ionic/angular';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { BarcodeScanner, BarcodeFormat, LensFacing, Barcode } from '@capacitor-mlkit/barcode-scanning';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { Frase } from 'src/app/classes/frase';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { DialogService } from 'src/app/services/dialog.service';
import { environment } from 'src/environments/environment.prod';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';





@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  fechaActual: Date = new Date();
  soloFecha : string = this.fechaActual.toISOString().split('T')[0];

  public messageEmail: any;
  public dataUser: any;
  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  public isSupported = false;
  public isPermissionGranted = false;
  barcodes: Barcode[] = [];
  ObjfraseDelDia: Frase[] = [];
  fraseDelDia: string;
  autorDelDia: string;
  numeroAleatorio: number;
  dataQr: string;

  utilidadesService = inject(UtilidadesService);
  firebaseService = inject(FirebaseService);
  animationCtrl = inject(AnimationController);
  alertController = inject(AlertController);
  apiService = inject(ApiservicesService);
  dialogService = inject(DialogService);
  ngZone = inject(NgZone);

  publicKey = environment.keyEmailJS;
  serviceId = environment.serviceId;
  templateId = 'template_mochxsq';

  templateParams = {
    nameProfesor: '',
    asignatura: '',
    name: '',
    email: '',
    message: '',
    fecha: '',
  };

  profesor: any;

  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef<HTMLIonCardElement>;

  public animation!: Animation;
  usuario = this.utilidadesService.obtieneElementoLocalStorage('usuario');
  public saludo = this.obtenerSaludo();

  ngOnInit() {
    // BarcodeScanner.isSupported().then((result) => {
    //   this.isSupported = result.supported;
    // });

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });

    this.getFraseDelDia();

  }

  /* QR CAMARA */

  public async startScan(): Promise<void> {
    const formats = "barcodeFormat.QrCode";
    const lensFacing = "lensFacing.Back";
    const element = await this.dialogService.showModal({
      component: BarcodeScanningModalComponent,
      // Set `visibility` to `visible` to show the modal (see `src/theme/variables.scss`)
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: formats,
        lensFacing: lensFacing,
      },
    });
    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      this.dataQr = result.data;
      if (barcode) {
        this.apiService.getDetalleAsignatura(1).subscribe(data => {
          this.templateParams.nameProfesor = data[0]['nombreTutor']
          this.templateParams.asignatura = data[0]['nombre_asignatura']
        })
        this.utilidadesService.presentAlert({
          header: 'Exito!',
          message: 'Se ha registrado la asistencia correctamente',
          buttons: [
            {
              text: 'Ok',
              role: 'confirm',
              cssClass: 'primary',
              handler: () => {
                this.enviaEmail();
                this.utilidadesService.routerLink('/tabs/tab2');
              },
            },
          ]
        })
      }
    });
  }

  async enviaEmail() {
    this.dataUser = this.firebaseService.obtieneDatos(this.usuario.email);
    await this.dataUser.then(data => {
      this.templateParams.email = 'cri.jimenez24@gmail.com';
      this.templateParams.name = data.name;
      this.templateParams.fecha = this.soloFecha;
      emailjs.send(this.serviceId, this.templateId, this.templateParams, this.publicKey)
    }).catch(error => {
      console.error('Error al traer los datos del usuario');
    })
  }

  /*********************************** */
  generarNumeroAleatorio() {
    return this.numeroAleatorio = Math.floor(Math.random() * 20) + 1;
  }

  getFraseDelDia() {
    this.apiService.getFraseDelDia(this.generarNumeroAleatorio()).subscribe((data) => {
      this.ObjfraseDelDia = data;
      this.fraseDelDia = this.ObjfraseDelDia[0].frase;
      this.autorDelDia = this.ObjfraseDelDia[0].autor;
    });
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
