import { inject } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { UtilidadesService } from "../services/utilidades.service";

export const loginGuard = () => {

    const firebaseService = inject(FirebaseService)
    const utilidadesService = inject(UtilidadesService);

    if(localStorage.getItem('usuario')){
        if(firebaseService.obtieneUsuarioAutenticado){
            return true;
        }
        return null;
    }else{
        utilidadesService.routerLink('/login');
        return false;
    }
}