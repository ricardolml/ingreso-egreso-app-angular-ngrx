import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class IngresoEgresoService {

    constructor(private firestore: AngularFirestore, private authService: AuthService) { }

    crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
        const uid = this.authService.user.uid;
        return this.firestore.doc(`${uid}/ingresos-egresos`)
            .collection('items')
            .add({ ...ingresoEgreso });
    }

    initIngresosEgresosListener( uid: string ) {
        this.firestore.collection(`${uid}/ingresos-egresos/items/`)
        .valueChanges()
        .subscribe( console.log );
    }


}
