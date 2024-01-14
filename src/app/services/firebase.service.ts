import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { Usuario } from '../interfaces/usuario';
import { getFirestore, getDoc, doc, setDoc } from '@angular/fire/firestore';
import { UtilidadesService } from './utilidades.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  utilidadesService = inject(UtilidadesService);

  // AUTENTICACIÓN DEL USUARIO
  autenticarUsuario(usuario: Usuario ){
    return signInWithEmailAndPassword(getAuth(), usuario.email, usuario.password);
  }

  // RECUPERA PASSWORD
  recuperarPassword(email : string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  // DEVUELVE TRUE SI EXISTE LOGUEO
  obtieneUsuarioAutenticado(){
    return getAuth();
  }

  // CERRAR SESION
  cerrarSesion(){
    getAuth().signOut();
    localStorage.removeItem('usuario'),
    this.utilidadesService.routerLink('/login');
  }



  // BASE DE DATOS FIREBASE

  // insertRegistros(path: string, data: any){
  //   return setDoc(doc(getFirestore(), path), data);
  // }

  async selectRegistro(path : string){
    return( await getDoc(doc(getFirestore(), path))).data();
  }

}
