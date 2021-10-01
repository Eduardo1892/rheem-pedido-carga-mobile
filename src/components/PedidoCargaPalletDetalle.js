import React, {useState, useEffect} from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput,  
View, FlatList, TouchableOpacity, Alert } from "react-native"
import clienteAxios from '../config/axios';
import { handleError } from '../helpers';
import { 
    colores, 
    buttonInputPrimary,
    buttonTextPrimary, 
    subtitulo,
    subtituloValor,
    viewContenido,
    textInputPrimary,
    itemFlatList,
    titulo
} from '../styles/AppStyles';


const PedidoCargaPalletDetalle = ({navigation,route}) => {
    

    const [producto ] = useState(route.params.producto)
    const{
        codigo_producto,
        cantidad_ingresada,
        cantidad_requerida,
        codigo_pedido_carga,
        descirpcion_producto,
    } = producto

    const [seriesPedidoCargaPallet, setSeriesPedidoCargaPallet] = useState([])

    const [seriePedidoCargaPallet, setSeriePedidoCargaPallet] = useState()

    const pallet = route.params.pallet

    useEffect(() => {
        listarSeriesPedidoCargaPallet()
    }, [])


    const listarSeriesPedidoCargaPallet = async () => {
        try{

            let resp = await clienteAxios.get('/api/pedido-carga-producto-series/listar',{
                params:{
                    codigoPedidoCarga: codigo_pedido_carga,
                    etiquetaPallet: pallet
                }
            })
            setSeriesPedidoCargaPallet(resp.data.seriesPedidoCargaPallet)
        } catch(e){
            handleError(e)
        }
    }

    const handleClickeliminarPedidoCargaPallet = async () => {
        try{

            let resp = await clienteAxios.delete('/api/pedido-carga-producto-series/eliminar-pallet',{
                params:{
                    codigoPedidoCarga: codigo_pedido_carga,
                    etiquetaPallet: pallet
                }
            })
            setSeriesPedidoCargaPallet([])
            Alert.alert('INFO','PALLET DESHECHO')
        } catch(e){
            handleError(e)
        }
    }

    const renderItem = ({ item }) => {


        const backgroundColor = seriesPedidoCargaPallet && item.codigo === seriesPedidoCargaPallet.codigo ? "#ff0000" : "#e8f0ed";
        const color = seriesPedidoCargaPallet && item.codigo === seriesPedidoCargaPallet.codigo  ? 'white' : 'black';
        return (
          <Item
            item={item}
            onPress={() => setSeriePedidoCargaPallet(item)}
            selectedStyle={{backgroundColor, color}}
          />
        );
    }

    const Item = ({ item, onPress, selectedStyle }) => {
        
       
        const {
            codigo_pedido_carga,
            codigo_producto,
            etiqueta_cliente,
            etiqueta_pallet,
            cantidad,
            numero_serie,
            createdAt,
        } = item
        return (
            <TouchableOpacity 
                onPress={onPress} 
                style={{
                    ...itemFlatList, 
                    backgroundColor: selectedStyle.backgroundColor, 
                }}
            >                
                <View>
                    {numero_serie !== ''
                    ?
                    <View style={viewContenido}>
                        <Text style={{...subtitulo, color: selectedStyle.color}}>N° SERIE: </Text>      
                        <Text style={{...subtituloValor, color: selectedStyle.color}}>{numero_serie}</Text>          
                    </View>
                    :
                    <View style={viewContenido}>
                        <Text style={{...subtitulo, color: selectedStyle.color}}>CANTIDAD: </Text>      
                        <Text style={{...subtituloValor, color: selectedStyle.color}}>{cantidad}</Text>          
                    </View>

                    }
                    
                    <View style={viewContenido}>
                        <Text style={{...subtitulo, color: selectedStyle.color}}>FECHA INGRESO: </Text>      
                        <Text style={{...subtituloValor, color: selectedStyle.color}}>{createdAt}</Text>          
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return ( 
        <SafeAreaView>
                <View>
                    <Text numberOfLines={1} style={{...titulo, margin: 5 }}>PALLET: {pallet}</Text>                
                </View>
                <View style={{margin: 5}}>
                    <TouchableOpacity
                        style={buttonInputPrimary}
                        color={colores.rojo}
                        onPress={handleClickeliminarPedidoCargaPallet}
                    >
                        <Text style={buttonTextPrimary}>
                            DESHACER PALLET
                        </Text>
                    </TouchableOpacity >
                </View>
                <View style={{margin: 5}}>
                    <FlatList
                        data={seriesPedidoCargaPallet}
                        renderItem={renderItem}
                    />
                </View> 
        </SafeAreaView>
    );
}


 
export default PedidoCargaPalletDetalle;