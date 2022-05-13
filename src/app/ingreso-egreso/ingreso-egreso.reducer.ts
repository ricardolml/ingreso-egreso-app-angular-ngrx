import { createReducer, on } from '@ngrx/store';
import * as ingresoEgreso from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso';

export interface State {
    items: IngresoEgreso[]
};

const initialState: State = {
    items: []
};

export const ingresoEgresoReducer = createReducer(
    initialState,
    on( ingresoEgreso.setItems , (state , { items } ) => ( { ...state, items: [...items] } ) ),
    on( ingresoEgreso.unSetItems , (state) => ( { ...state, items: [] } ) ),
);