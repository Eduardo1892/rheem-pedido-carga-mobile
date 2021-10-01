import React, {useEffect, useState} from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, Button, Alert, 
View, ToastAndroid, TouchableOpacity } from "react-native"
import clienteAxios from '../config/axios';
import { handleError } from '../helpers';
import { colores, buttonInputPrimary, textInputPrimary, labelInputText, titulo, viewContenido, subtitulo, subtituloValor, buttonTextPrimary } from '../styles/AppStyles';


const PedidoCargaCantidad = ({navigation, route}) => {
    
  const [producto, setProducto] = useState(route.params.producto)
  //Valor del textInput cantidad
  const [cantidad, setCantidad] = useState("");
  //Valor que indica la cantidad que falta para completar el producto.
  const [cantidadIngresada, setCantidadIngresada] = useState(0)
  //Indica si el producto esta finalizado
  const [productoFinalizado, setProductoFinalizado] = useState(false)
  //Indica si el pedido está finalizado
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false)

  useEffect(() => {

    const cantidadIngresada = parseInt(route.params.producto.cantidad_ingresada)
    setCantidadIngresada(cantidadIngresada)

  }, [route.params])
  
  const handleClickRegistrarCantidad = async () => {
    try{
      let resp = await clienteAxios.post('/api/pedido-carga-producto-series/crear',{
            codigoPedidoCarga: producto.codigo_pedido_carga,
            codigoProducto: producto.codigo_producto,
            etiquetaPallet: route.params.pallet,
            numeroSerie: '',
            cantidad,
            porSerie: false
      })
      const { cantidadPendiente, producto_finalizado, pedido_finalizado } = resp.data
     
      setProductoFinalizado(producto_finalizado)
      setPedidoFinalizado(pedido_finalizado)
      setCantidadIngresada(cantidadIngresada + parseInt(cantidad))
      setCantidad('')
      

    } catch(e){
        handleError(e)
        setCantidad('')
    }

  }

  const handleClickAvanzarPedido = async () => {

    try{

      let resp = await clienteAxios.post('/api/pedido-carga-tracking/crear',{
        codigoPedidoCarga: producto.codigo_pedido_carga,
        codigoUsuario: "system",
        codigoEstado: '3',
        comentario: "se avanzó completó"
      })
      Alert.alert('INFO','PEDIDO AVANZADO CORRECTAMENTE')
      navigation.navigate('PedidoCarga')

    } catch(e){
      handleError(e)
    }

  }

  return ( 
      <SafeAreaView>
            <View style={{margin: 5}}>
                <View>
                    <Text numberOfLines={1} style={titulo}>{producto.descripcion_producto.toUpperCase()}</Text>      
                </View>
                <View style={viewContenido}>
                    <Text style={subtitulo}>N° PRODUCTO: </Text>      
                    <Text style={subtituloValor}>{producto.codigo_producto}</Text>          
                </View>
                <View style={viewContenido}>
                    <Text style={subtitulo}>N° PALLET: </Text>      
                    <Text style={subtituloValor}>{route.params.pallet}</Text>          
                </View>
                <View style={viewContenido}>
                    <Text style={subtitulo}>INGRESADOS: </Text>      
                    <Text style={subtituloValor}>{`${cantidadIngresada}/${producto.cantidad_requerida}`}</Text>          
                </View>
            </View>          
            <View> 
              {(productoFinalizado && !pedidoFinalizado) &&
                //Mostrar boton que lleva a los productos.
                <View style={{margin: 5}}>
                    <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={() => {
                            navigation.navigate('PedidoCargaDetalle', {
                                codigoPedidoCarga: producto.codigo_pedido_carga
                            })
                        }}
                    >
                        <Text style={buttonTextPrimary}>
                            MOSTRAR PRODUCTOS
                        </Text>
                    </TouchableOpacity >
                </View>
              }   
              {(productoFinalizado && pedidoFinalizado) &&
                //Mostrar boton que avanza el pedido al siguiente estado
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
              {(!productoFinalizado && !pedidoFinalizado) &&
                <View style={{margin: 5}}>
                    <TextInput
                        style={{...textInputPrimary, textAlign: 'center'}}
                        onChangeText={setCantidad}
                        value={cantidad}
                        placeholder="INGRESE CANTIDAD"
                    />
                    <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={handleClickRegistrarCantidad} 
                    >
                        <Text style={buttonTextPrimary}>
                            REGISTRAR CANTIDAD
                        </Text>
                    </TouchableOpacity >
                </View>
              }   
            </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  viewTituloContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  viewTitulo:{
      alignItems: 'center'
  },
  titulo: {
      color: 'black',
      fontSize: 20,
      fontWeight: '700',
      overflow: 'hidden',
  },
  contenido: {
      color: 'black',
      fontSize: 18,
      fontWeight: '500',
      overflow: 'hidden',
  },
  viewContenido: {
    color: 'black',
    fontSize: 25,
    fontWeight: '700',
    overflow: 'hidden',
  },
  estacionTitle: {
      color: 'black',
      fontSize: 14,
      fontWeight: '400',
      overflow: 'hidden',
  },
  item: {
      borderRadius: 10,
      marginBottom: 5,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 4,
  },
  itemName: {
      color: 'black',
      fontSize: 25,
      marginBottom: 5,
  },
  cantContainerWithoutStock: {
      backgroundColor: 'whitesmoke',
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 15,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 2,
  },
  cantContainerWithStock: {
      backgroundColor: 'whitesmoke',
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 2,
  },
  cantTitle: {
      color: 'black',
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
  },
  cantText:{    
      color: 'black',
      fontSize: 36,
      fontWeight: '500',
      textAlign: 'center',
  },
  
});


 
export default PedidoCargaCantidad;