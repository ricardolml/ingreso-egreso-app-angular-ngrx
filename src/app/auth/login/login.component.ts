import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
    ]
})
export class LoginComponent implements OnInit, OnDestroy {

    loginFrom = this.fb.group({
        correo: ['ricardo@gmail.com', [Validators.required, Validators.email]],
        password: ['123456', [Validators.required]],
    });

    loading=  false;
    uiSubscription!: Subscription;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {
        this.uiSubscription = this.store.select('ui').subscribe( ui => {
            this.loading = ui.isLoading;
        });
    }

    ngOnDestroy(): void {
        this.uiSubscription?.unsubscribe();
    }

    login() {
        if (this.loginFrom.invalid) { return; }

        this.store.dispatch( ui.isLoading() );
        
        const { correo, password } = this.loginFrom.value;
        this.authService.loginUser(correo, password).then(
            credentials => {
                this.store.dispatch( ui.stopLoading() );
                this.router.navigateByUrl('/');
            }
        ).catch(err => {
            this.store.dispatch( ui.stopLoading() );
            Swal.fire({
                title: 'Oops...!',
                text: err.message,
                icon: 'error',
            });
        });
    }

}
