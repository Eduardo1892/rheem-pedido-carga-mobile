import React, { useReducer } from 'react'
import clienteAxios from '../../config/axios'
import tokenAuth from '../../config/token'
import { handleError } from '../../helpers'
import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from '../types'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'


const AuthState = props => {
    
    const initialState = {
        usuario: null,
        rol: null,
        maquina: null,
        autenticado: false,
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState)


    //debo envíar rol tambien
    const iniciarSesion = async (codigo, clave, codigoRol) => {
        
        try{

            let resp = await clienteAxios.post('/api/auth',{
                codigo,
                clave,
                codigoRol,
            })

            const token = resp.data.token
            if(token){
                tokenAuth(token)
            }

            resp = await clienteAxios.get('/api/auth/datos')

            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    usuario: resp.data.usuario,
                    rol: resp.data.rol
                }
            })

        }catch(e){
            handleError(e)
            dispatch({
                type: LOGIN_ERROR
            })
        }
    }

    const cerrarSesion = () => {
        dispatch({
            type: LOGOUT
        })
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: state.usuario,
                rol: state.rol,
                maquina: state.maquina,
                autenticado: state.autenticado,
                iniciarSesion,
                cerrarSesion,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )


}
 
export default AuthState;