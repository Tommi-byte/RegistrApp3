import { inject } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { UtilidadesService } from "../services/utilidades.service";

export const NologinGuard = () => {

    const firebaseService = inject(FirebaseService)
    const utilidadesService = inject(UtilidadesService);

    if (!localStorage.getItem('usuario')) {
        if (firebaseService.obtieneUsuarioAutenticado) {
            return true;
        }
        return null;
    } else {
        if (localStorage.getItem('usuario[type]') == 'estudiante') {
            utilidadesService.routerLink('/tabs/tab1');
            return false;

        } else {
            utilidadesService.routerLink('/home/profesor');
            return false;

        }
    }
}