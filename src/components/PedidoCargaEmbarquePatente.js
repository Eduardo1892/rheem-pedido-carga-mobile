import React, {useState} from 'react'
import {  Alert, SafeAreaView, Text, TextInput,  
View, TouchableOpacity} from "react-native"
import clienteAxios from '../config/axios';
import { handleError } from '../helpers';
import { 
    colores, 
    buttonInputPrimary,
    buttonTextPrimary, 
    textInputPrimary
} from '../styles/AppStyles';

const PedidoCargaEmbarquePatente = ({route, navigation}) => {
    
    
    const { pedidoCarga } = route.params
    const { codigo_pedido_carga, codigo_usuario, rut_cliente} = pedidoCarga

    //Valor del textInput patente
    const [patente, setPatente] = useState("");
    const [patenteIngresada, setPatenteIngresada] = useState(false)

    const ingresarPatente = async () => {
        try{

            let resp = await clienteAxios.put('/api/pedido-carga/actualizar-patente',{
                    codigo: codigo_pedido_carga,
                    patente
            })
            setPatenteIngresada(true)

        } catch(e){
            handleError(e)
        }
    }

    const handleClickAvanzarPedido = async () => {

        try{
    
          let resp = await clienteAxios.post('/api/pedido-carga-tracking/crear',{
            codigoPedidoCarga: codigo_pedido_carga,
            codigoUsuario: "system",
            codigoEstado: '5',
            comentario: "se avanzó el pedido"
          })    
          Alert.alert('INFO','PEDIDO AVANZADO CORRECTAMENTE')
          navigation.navigate('PedidoCarga')
          
        } catch(e){
          handleError(e)
        }
    
      }

    return ( 
        <SafeAreaView>
            {!patenteIngresada &&
                <View style={{margin: 5}}>
                    <TextInput
                        style={{...textInputPrimary, textAlign: 'center'}}
                        onChangeText={setPatente}
                        value={patente}
                        placeholder="PATENTE"
                    />
                    <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={ingresarPatente} 
                    >
                        <Text style={buttonTextPrimary}>
                            INGRESAR PATENTE
                        </Text>
                    </TouchableOpacity >
                </View>
            }
            {patenteIngresada &&
                <View style={{margin: 5}}>
                    <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={handleClickAvanzarPedido} 
                    >
                        <Text style={buttonTextPrimary}>
                            AVANZAR PEDIDO
                        </Text>
                    </TouchableOpacity >
                </View>
            }
        </SafeAreaView>
    );
}


 
export default PedidoCargaEmbarquePatente;