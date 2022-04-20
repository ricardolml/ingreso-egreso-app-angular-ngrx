import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [
    ]
})
export class RegisterComponent implements OnInit {

    registerForm = this.fb.group({
        nombre: [ 'Ricardo' , [Validators.required] ],
        correo: [ 'ricardo@gmail.com' , [Validators.required , Validators.email] ],
        password: [ '123456' , [Validators.required] ],
    })
    loading = false;
    uiSubscription!: Subscription;

    constructor(
        private fb: FormBuilder,
        private authServcie: AuthService,
        private router: Router,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {
        this.uiSubscription = this.store.select('ui').subscribe( ({ isLoading }) => this.loading = isLoading );
    }

    ngOnDestroy(): void {
        this.uiSubscription.unsubscribe();
    }

    createUser(){

        if( this.registerForm.invalid ){ return ; }

        this.store.dispatch( ui.isLoading() );

        const { nombre, correo, password } = this.registerForm.value;
        
        this.authServcie.crearUsario( nombre, correo, password ).then(
            credenciales => {
                this.store.dispatch( ui.stopLoading() );
                this.router.navigateByUrl('/');
            }
        ).catch( err => {
            this.store.dispatch( ui.stopLoading() );
            
            Swal.fire({
                title: 'Oops...!',
                text: err.message ,
                icon: 'error',
            });
        } );
    }

}
