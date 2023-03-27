import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map} from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';





@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  chats: Mensaje[] = [];
  usuario: any = {};

  constructor( private afs: AngularFirestore, public afAuth: AngularFireAuth ) {

    this.afAuth.authState.subscribe( user => {

      console.log('Estado del usuario', user);

      if(!user){
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });

   }

  login( proveedor: string ) {
    if( proveedor === "google" ){
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes() {

    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc').limit(5));

    return  this.itemsCollection.valueChanges()
                                .pipe(
                                  map( (mensajes: Mensaje[]) => {
                                    console.log(mensajes );

                                    this.chats = [];

                                    for(let mensaje of mensajes ){
                                      this.chats.unshift(mensaje);
                                    }

                                    return this.chats;

                                  })
                                );
  }


  agregarMensaje( texto:string ) {

    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid

    }

    return this.itemsCollection.add(mensaje);

  }
}
