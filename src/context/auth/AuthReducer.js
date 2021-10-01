import React from 'react'
import {
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT
} from '../types/index'


const authReducer = (state, action) => {
    
    switch (action.type) {
        case LOGIN_SUCCESS:
            return{
                ...state,
                usuario: action.payload.usuario,
                rol: action.payload.rol,
                autenticado: true,
            }
        case LOGOUT:
        case LOGIN_ERROR:
            return{
                ...state,
                usuario: null,
                rol: null,
                autenticado: false,
            }
        default:
            return state
    }


}
 
export default authReducer;