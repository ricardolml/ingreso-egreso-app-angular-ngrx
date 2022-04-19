import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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

    constructor(private fb: FormBuilder, private authServcie: AuthService, private router: Router) { }

    ngOnInit(): void {

    }

    createUser(){

        if( this.registerForm.invalid ){ return ; }

        const { nombre, correo, password } = this.registerForm.value;
        
        this.authServcie.crearUsario( nombre, correo, password ).then(
            credenciales => this.router.navigateByUrl('/')
        ).catch( err => {
            Swal.fire({
                title: 'Oops...!',
                text: err.message ,
                icon: 'error',
            });
        } );
    }

}
