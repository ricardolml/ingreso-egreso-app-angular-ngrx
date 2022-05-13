import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userSubscription!: Subscription;
    private _user!: Usuario | null;

    get user(){
        return { ...this._user };
    }

    constructor( public auth: AngularFireAuth , public firestore: AngularFirestore, private store: Store<AppState> ) { }

    

    initAuthListener(){
        this.auth.authState.subscribe( fuser => {

            if( fuser ){
                this.userSubscription = this.firestore.doc( `${ fuser.uid }/usuario` ).valueChanges().subscribe(
                    firestoreUser => {
                        const user = Usuario.fromFirebase( firestoreUser );
                        this._user = user;
                        this.store.dispatch( authActions.setUser( { user } ) );
                    }
                ); 
            }else{
                this._user = null;
                this.userSubscription?.unsubscribe();
                this.store.dispatch( authActions.unSetUser() );
            }

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
