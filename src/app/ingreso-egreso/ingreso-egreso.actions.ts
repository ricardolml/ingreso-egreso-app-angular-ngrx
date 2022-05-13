import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso';

export const unSetItems = createAction('[IngresoEgraso] Unset Items');
export const setItems = createAction(
    '[IngresoEgraso] setItems',
    props<{ items: IngresoEgreso[] }>()
);

