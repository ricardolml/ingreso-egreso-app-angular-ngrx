import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-ingreso-egreso',
    templateUrl: './ingreso-egreso.component.html',
    styles: [
    ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

    ingresoFomr = this.fb.group({
        descripcion: ['', Validators.required],
        monto: ['', Validators.required],
    });

    tipo = 'Ingreso';

    loading = false;
    suscription!: Subscription;

    constructor(private fb: FormBuilder, private ingresoEgreso: IngresoEgresoService, private store: Store<AppState>) { }

    ngOnInit(): void {
        this.suscription = this.store.select('ui').subscribe( ( {isLoading} ) => this.loading = isLoading );
    }
    
    ngOnDestroy() : void {
        this.suscription?.unsubscribe();
    }

    guardar() {
        this.store.dispatch( ui.isLoading() );

        if (this.ingresoFomr.invalid) return;
        const { descripcion, monto } = this.ingresoFomr.value;
        const ingresoEgreso = new IngresoEgreso(descripcion , monto , this.tipo );

        this.ingresoEgreso.crearIngresoEgreso(ingresoEgreso).then(
            () => {

                this.ingresoFomr.reset();
                this.store.dispatch( ui.stopLoading() );
                Swal.fire('Registro Creado', descripcion , 'success');

            }
        ).catch( err => {
            Swal.fire( 'Erros' , err.message , 'error');
            this.store.dispatch( ui.stopLoading() );
        });


    }

}
