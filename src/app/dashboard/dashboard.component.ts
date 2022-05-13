import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: [
    ]
})
export class DashboardComponent implements OnInit {

    suscription!: Subscription;

    constructor(private store: Store<AppState> , private ingresosEgresosServices : IngresoEgresoService) { }

    ngOnInit(): void {
        this.suscription = this.store.select('auth')
            .pipe(
                filter(auth => auth.user !== null)
            )
            .subscribe(({ user }) => {
                this.ingresosEgresosServices.initIngresosEgresosListener( user!.uid );
            });
    }

    ngOnDestroy(): void {
        this.suscription?.unsubscribe();
    }

}
