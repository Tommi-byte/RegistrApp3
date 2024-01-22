import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { Usuario } from '../interfaces/usuario';
import { getFirestore, getDoc, doc, setDoc } from '@angular/fire/firestore';
import { UtilidadesService } from './utilidades.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  starCountRef: any;
  data: any;
  auth = inject(AngularFireAuth);
  utilidadesService = inject(UtilidadesService);
  items: Observable<any[]>;

  // PARA TRAER LOS DATOS DEL USUARIO
  docRef: any;
  docSnap: any;
  user : any;

  async obtieneDatos(email) {
    this.docRef = doc(getFirestore(), "usuarios", email);
    this.docSnap = await getDoc(this.docRef);
    if (this.docSnap.exists()) {
      return this.docSnap.data()
    } else {
      // docSnap.data() will be undefined in this case
      return false;
    }
  }

  // AUTENTICACIÓN DEL USUARIO
  autenticarUsuario(usuario: Usuario) {
    return signInWithEmailAndPassword(getAuth(), usuario.email, usuario.password);
  }

  // AUTENTICACIÓN DEL USUARIO
  async obtieneTokenId() {
    return (await this.auth.currentUser).getIdToken;
  }

  // RECUPERA PASSWORD
  recuperarPassword(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // DEVUELVE TRUE SI EXISTE LOGUEO
  obtieneUsuarioAutenticado() {
    return getAuth();
  }

  // CERRAR SESION
  cerrarSesion() {
    getAuth().signOut();
    localStorage.removeItem('usuario'),
      this.utilidadesService.routerLink('/login');
  }


  async actualizarContrasena(nuevaContrasena: string) {
    try {
      const user = await this.auth.currentUser;
      
      if (user) {
        await user.updatePassword(nuevaContrasena);
        console.log('Contraseña actualizada exitosamente');
      } else {
        console.error('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
    }
  }

  // BASE DE DATOS FIREBASE

  // insertRegistros(path: string, data: any){
  //   return setDoc(doc(getFirestore(), path), data);
  // }

  async selectRegistro(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  async setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

}
