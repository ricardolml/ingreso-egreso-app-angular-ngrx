import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
    ]
})
export class LoginComponent implements OnInit {

    loginFrom = this.fb.group({
        correo: ['ricardo@gmail.com', [Validators.required, Validators.email]],
        password: ['123456', [Validators.required]],
    });

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
    }

    login() {
        if (this.loginFrom.invalid) { return; }

        Swal.fire({title: 'Espere por favor !'});
        Swal.showLoading();

        const { correo, password } = this.loginFrom.value;
        this.authService.loginUser(correo, password).then(
            credentials => {
                Swal.close();
                this.router.navigateByUrl('/');
            }
        ).catch(err => {
            Swal.fire({
                title: 'Oops...!',
                text: err.message,
                icon: 'error',
            });
        });
    }

}
