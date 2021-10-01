import { Alert } from 'react-native'

export const handleError = (e) => {

    console.log(e)
    //console.log(JSON.stringify(e))
    //error de servidor.
    if(!e.response){
       
        Alert.alert('ERROR', 'Algo va mal, vuelva a intentar')

    //rescata los errores generados por validaciones sin express-validator 
    }else if(e.response.data.hasOwnProperty('msg')){

        //si es un error por token, elimina el token del localstorage.
        if(e.response.data.msg === 'TokenExpiredError' || e.response.data.msg === 'TokenMissingError'){
            Alert.alert('ERROR', 'Sesión finalizada')
        }else{
            Alert.alert('ERROR', e.response.data.msg.toUpperCase())
        }

    }else{
        Alert.alert('ERROR',  e.message.toUpperCase())
    }
    
}