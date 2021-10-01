import React, {useState, useEffect, useContext} from 'react'
import { SafeAreaView, Button, Alert, 
View, Text, FlatList, TouchableOpacity } from "react-native"
import AuthContext from '../context/auth/AuthContext';
import clienteAxios from '../config/axios';
import { handleError } from '../helpers';
import {  
     colores, 
     buttonInputPrimary, 
     buttonTextPrimary, 
     subtitulo, 
     subtituloValor, 
     viewContenido, 
     titulo,
     itemFlatList,
     subtituloNumeroGrande,
     viewTituloContainer,
     viewTitulo} from '../styles/AppStyles';


const PedidoCargaDetalle = ({navigation, route}) => {

  const [pedidoCarga, setPedidoCarga] = useState(null)
  const {
    codigo_pedido_carga, 
    codigo_estado, 
    codigo_usuario, 
    orden_compra, 
    orden_venta
  } = pedidoCarga ? pedidoCarga : {}
  //valor seleccionado en la lista
  const [pedidoCargaProducto, setPedidoCargaProducto] = useState(null);
  const [pedidoCompleto, setPedidoCompleto] = useState(false)
  //variables globales
  const { usuario, rol } = useContext(AuthContext)

  const [pedidoCargaProductos, setPedidoCargaProductos] = useState([])

  useEffect(() => { 
    if(route.params?.codigoPedidoCarga){
      getDatosPedidoCarga()
    }
  }, [route.params])

  useEffect(() => {

    if(pedidoCarga){
      listarProductosPedidoCarga()
    }

  }, [pedidoCarga])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      getDatosPedidoCarga()
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
}, [navigation])

  const getDatosPedidoCarga = async () => {
    try{

        let resp = await clienteAxios.get('/api/pedido-carga/datos',{
            params:{
                codigoPedidoCarga: route.params.codigoPedidoCarga,
            }
        })
 
        setPedidoCarga(resp.data.pedidoCarga)
        setPedidoCompleto(resp.data.pedidoFinalizado)

    } catch(e){
        handleError(e)
    }
  }

  const listarProductosPedidoCarga = async () => {
    try{
        
        let resp = await clienteAxios.get('/api/pedido-carga-producto/listar',{
            params:{
                codigoPedidoCarga: pedidoCarga.codigo_pedido_carga
            }
        })
        setPedidoCargaProductos(resp.data.pedidoCargaProductos)
    } catch(e){
        handleError(e)
    }
  }
  
  const handleClickTomarPedido = async (codigoEstado) => {

    try{

      let resp = await clienteAxios.post('/api/pedido-carga-tracking/crear',{
        codigoPedidoCarga: pedidoCarga.codigo_pedido_carga,
        codigoUsuario: usuario.codigo,
        codigoEstado,
        comentario: "se tomó pedido"
      })

      setPedidoCarga({
        ...pedidoCarga,
        codigo_estado: codigoEstado,
      })
      console.log(pedidoCarga.codigo_estado)
      Alert.alert('INFO','PEDIDO TOMADO CORRECTAMENTE')


    } catch(e){
      handleError(e)
    }

  }

  const handleClickAvanzarPedido = async () => {

    try{

      let resp = await clienteAxios.post('/api/pedido-carga-tracking/crear',{
        codigoPedidoCarga: codigo_pedido_carga,
        codigoUsuario: "system",
        codigoEstado: '3',
        comentario: "se avanzó el pedido"
      })

      setPedidoCarga({
        ...pedidoCarga,
        codigo_estado: '3',
      })

      Alert.alert('INFO','PEDIDO AVANZADO CORRECTAMENTE')
      navigation.navigate('PedidoCarga')
      

    } catch(e){
      handleError(e)
    }

  }

  const renderItem = ({ item }) => {
    let backgroundColor = ""
    let color = pedidoCargaProducto && item.codigo === pedidoCargaProducto.codigo ? 'white' : 'black';

    if (pedidoCargaProducto && item.codigo === pedidoCargaProducto.codigo ){
      backgroundColor = "#ff0000"
    }else if (item.cantidad_requerida === item.cantidad_ingresada){
      backgroundColor = '#B2BABB'
      color = '#000'
    }else{
      backgroundColor =  "#e8f0ed"
    }


    return (
      <Item
        item={item}
        onPress={() => {setPedidoCargaProducto(item)}}
        selectedStyle={{backgroundColor, color}}
      />
    );
  }

  const Item = ({ item, onPress, selectedStyle }) => {

    const {
        codigo_producto, descripcion_producto,
        cantidad_requerida, cantidad_ingresada
    } = item

    return(
        <TouchableOpacity 
          onPress={onPress} 
          key={codigo_producto}
          style={{
            ...itemFlatList, 
            backgroundColor: selectedStyle.backgroundColor, 
          }}
        >
          <View>
              <View>
                  <Text numberOfLines={1} style={{...titulo, color: selectedStyle.color}}>{descripcion_producto.toUpperCase()}</Text>      
              </View>
              <View style={viewContenido}>
                  <Text style={{...subtitulo, color: selectedStyle.color}}>N° PRODUCTO: </Text>      
                  <Text style={{...subtituloValor, color: selectedStyle.color}}>{codigo_producto}</Text>          
              </View>
              <View style={viewTituloContainer}>
                <View style={viewTitulo}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>Requeridos</Text>
                    <Text style={{...subtituloNumeroGrande, color: selectedStyle.color}}>{cantidad_requerida}</Text>
                </View>
                <View style={viewTitulo}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>Ingresados</Text>
                    <Text style={{...subtituloNumeroGrande, color: selectedStyle.color}}>{cantidad_ingresada}</Text>
                </View>
              </View>
          </View>
        </TouchableOpacity>
    )
  }
  
  return ( 
      <SafeAreaView>
          <View style={{margin: 5}}>
              <View style={viewContenido}>
                  <Text style={subtitulo}>N° PEDIDO: </Text>      
                  <Text style={subtituloValor}>{codigo_pedido_carga}</Text>          
              </View>
              <View style={viewContenido}>
                  <Text style={subtitulo}>N° ORDEN COMPRA: </Text>      
                  <Text style={subtituloValor}>{orden_compra}</Text>          
              </View>
              <View style={viewContenido}>
                  <Text style={subtitulo}>N° ORDEN VENTA: </Text>      
                  <Text style={subtituloValor}>{orden_venta}</Text>          
              </View>
          </View>
        
            {(rol.codigo === "2" && codigo_estado === "1") &&
             <View style={{margin: 5}}>
               <TouchableOpacity
                    style={buttonInputPrimary}
                    color={colores.rojo}
                    onPress={() => {
                      handleClickTomarPedido("2")
                    }} 
                >
                    <Text style = {buttonTextPrimary}>
                        TOMAR PEDIDO
                    </Text>
                </TouchableOpacity >
            </View>
            }
            {(rol.codigo === "3" && codigo_estado === "3") &&
              <View style={{margin: 5}}>
                <TouchableOpacity
                    style={buttonInputPrimary}
                    color={colores.rojo}
                    onPress={() => {
                      handleClickTomarPedido("4")
                    }} 
                >
                    <Text style = {buttonTextPrimary}>
                        TOMAR PEDIDO
                    </Text>
                </TouchableOpacity >
              </View>
            }
            {(rol.codigo === "2" && codigo_estado === "2") &&
              <View style={{margin: 5}}>
                    <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={() => {
                          if(!pedidoCargaProducto){
                            Alert.alert('INFO','DEBE SELECCIONAR UN PRODUCTO')
                            return
                          }
                          navigation.navigate('PedidoCargaPallet',{
                            pedidoCargaProducto
                          })
                        }} 
                    >
                        <Text style = {buttonTextPrimary}>
                            PALETIZAR
                        </Text>
                    </TouchableOpacity >
              </View>
            }
            {(pedidoCompleto && codigo_estado === "2") &&
              <View style={{margin: 5}}>
                  <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={handleClickAvanzarPedido}
                  >
                    <Text style = {buttonTextPrimary}>
                            AVANZAR PEDIDO
                      </Text>
                  </TouchableOpacity>
              </View>
            }
            {(rol.codigo === "3" && codigo_estado === "4") &&
                <View style={{margin: 5}}>
                  <TouchableOpacity
                      style={buttonInputPrimary}
                      color={colores.rojo}
                      onPress={() => {
                        navigation.navigate('PedidoCargaEmbarquePallet',{
                          pedidoCarga
                        })
                      }}
                  >
                      <Text style = {buttonTextPrimary}>
                          EMBARCAR
                      </Text>
                  </TouchableOpacity >
                </View>
            }
            <View style={{margin: 5}}>
              <FlatList
                  data={pedidoCargaProductos}
                  renderItem={renderItem}
              />
            </View>
      </SafeAreaView>
  );
}

 
export default PedidoCargaDetalle;