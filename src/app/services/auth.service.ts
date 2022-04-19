import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor( public auth: AngularFireAuth , public firestore: AngularFirestore ) { }

    initAuthListener(){
        this.auth.authState.subscribe( user => {

            console.log(user)
        });
    }

    crearUsario( nombre: string, email: string, password: string ){

        return this.auth.createUserWithEmailAndPassword( email, password ).then( ({ user }) => {

            if( !user ) { return; }
            
            const newUser = new Usuario( user.uid, nombre, user.email ) ;
            return this.firestore.doc(`${ user?.uid}/usuario`).set( { ...newUser } );
        });
    }

    loginUser( email: string , password: string ){
        return this.auth.signInWithEmailAndPassword( email, password )
    }

    logoutUser(){
        return this.auth.signOut();
    }

    isAuth(){
        return this.auth.authState.pipe(
            map( user => user != null )
        );
    }
}
