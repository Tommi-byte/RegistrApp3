import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AnimationController, IonCard } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import type { Animation } from '@ionic/angular';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  utilidadesService = inject(UtilidadesService);
  firebaseService = inject(FirebaseService);
  animationCtrl = inject(AnimationController);

  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef<HTMLIonCardElement>;

  public animation!: Animation;
  usuario = this.utilidadesService.obtieneElementoLocalStorage('usuario');
  public saludo = this.obtenerSaludo();

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
    } else if (horaActual >= 12 && horaActual < 18) {
      saludo = '¡Buenas tardes!, ' + this.usuario.name;
    } else {
      saludo = '¡Buenas noches!, ' + this.usuario.name;
    }

    return saludo;
  }


}
