import React, {useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, TextInput, Button, Alert, 
View, Text, TouchableOpacity } from "react-native"
import clienteAxios from '../config/axios';
import { handleError } from '../helpers';

import { 
    colores, 
    buttonInputPrimary, 
    buttonTextPrimary,
    textInputPrimary, 
    subtitulo, 
    subtituloValor, 
    titulo, 
    viewContenido } from '../styles/AppStyles';

    const PedidoCargaPallet = ({navigation, route}) => {

    const [producto, setProducto] = useState(route.params.pedidoCargaProducto)

    const {
        codigo_producto,
        descripcion_producto,
        cantidad_ingresada, 
        cantidad_requerida, 
        codigo_pedido_carga,
     } = producto

    const [pallet, setPallet] = useState("");

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          getCantidadesProducto()
          // Call any action
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const getCantidadesProducto = async () => {
        try {
            
            const resp = await clienteAxios.get('/api/pedido-carga-producto/cantidades', {
                params: {
                    codigoPedidoCarga: codigo_pedido_carga,
                    codigoProducto: codigo_producto
                }
            })
            const { cantidad_ingresada, cantidad_requerida } = resp.data.cantidadesPedidoCargaProducto
            setProducto({
                ...producto,
                cantidad_ingresada,
            })

        } catch (e) {
            handleError(e)
        }
    }

    return ( 
    <SafeAreaView>
        <View style={{margin: 5}}>
            <View>
                <Text numberOfLines={1} style={titulo}>{descripcion_producto.toUpperCase()}</Text>      
            </View>
            <View style={viewContenido}>
                <Text style={subtitulo}>N° PRODUCTO: </Text>      
                <Text style={subtituloValor}>{codigo_producto}</Text>          
            </View>
            <View style={viewContenido}>
                <Text style={subtitulo}>REQUERIDOS: </Text>      
                <Text style={subtituloValor}>{cantidad_requerida}</Text>          
            </View>
            <View style={viewContenido}>
                <Text style={subtitulo}>INGRESADOS: </Text>      
                <Text style={subtituloValor}>{cantidad_ingresada}</Text>          
            </View>
        </View>
        <View>
            <TextInput
                style={{
                    ...textInputPrimary,
                    textAlign: 'center'
                }}
                onChangeText={setPallet}
                value={pallet}
                placeholder="INGRESE ETIQUETA PALLET"
            />
        </View>
        <View style={{margin: 10}}>
            <Text style={{...subtitulo, textAlign: 'center'}}>SELECCIONE TIPO DE INGRESO</Text>
        </View>
        <View style={{margin: 5}}>
            <TouchableOpacity
                style={buttonInputPrimary}
                color={colores.rojo}
                onPress={() => {
                    if(pallet.trim() === ""){
                        Alert.alert('INFO','INGRESE ETIQUETA PALLET')
                        return
                    }
                    
                    navigation.navigate('PedidoCargaCantidad',{
                        producto,
                        pallet
                    })

                    setPallet('')
                }}
            >
                <Text style = {buttonTextPrimary}>
                    INGRESO POR CANTIDAD
                </Text>
            </TouchableOpacity>
        </View>
        <View style={{margin: 5}}>
            <TouchableOpacity
                style={buttonInputPrimary}
                color={colores.rojo}
                onPress={() => {
                    if(pallet.trim() === ""){
                        Alert.alert('INFO','INGRESE ETIQUETA PALLET')
                        return
                    }
                    navigation.navigate('PedidoCargaSeries',{
                        producto,
                        pallet
                    })

                    setPallet('')
                }}
            >
                <Text style = {buttonTextPrimary}>
                    INGRESO POR N° SERIE
                </Text>
            </TouchableOpacity>
        </View> 
        <View style={{margin: 5}}>
            <TouchableOpacity
                style={buttonInputPrimary}
                color={colores.rojo}
                onPress={() => {
                    if(pallet.trim() === ""){
                        Alert.alert('INFO','INGRESE ETIQUETA PALLET')
                        return
                    }
                    navigation.navigate('PedidoCargaPalletDetalle',{
                        producto,
                        pallet
                    })

                    setPallet('')
                }}
            >
                <Text style = {buttonTextPrimary}>
                    DETALLE PALLET
                </Text>
            </TouchableOpacity>
        </View>   
    </SafeAreaView>
  );
}
 
export default PedidoCargaPallet;