import React, {useState} from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput,  
View, FlatList, TouchableOpacity } from "react-native"
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
    itemFlatList
} from '../styles/AppStyles';


const PedidoCargaEmbarquePallet = ({navigation,route}) => {
    

    const { pedidoCarga } = route.params
    const { codigo_pedido_carga, codigo_usuario, rut_cliente} = pedidoCarga

    //Valor del textInput pallet
    const [pallet, setPallet] = useState("");
    //Valor del textInput serieCliente
    const [etiquetaCliente, setEtiquetaCliente] = useState("");
    //Almacena pallet serie cliente
    const [palletsEtiquetasCliente, setPalletsEtiquetasCliente] = useState([])
    const [etiquetaIngresada, setEtiquetaIngresada] = useState(false)
    const [palletEtiquetaCliente, setPalletEtiquetaCliente] = useState()


    const embarcarPallet = async () => {
        try{
        let resp = await clienteAxios.put('/api/pedido-carga-producto-series/actualizar',{
            codigoPedidoCarga: codigo_pedido_carga,
            pallet,
            serieCliente: etiquetaCliente

        })
        
        let newPalletEtiquetaCliente = []
        if(palletsEtiquetasCliente.length > 0){
            newPalletEtiquetaCliente = palletsEtiquetasCliente.filter(item => item.pallet !== pallet && item.etiquetaCliente !== etiquetaCliente)
            newPalletEtiquetaCliente.push({
                pallet,
                etiquetaCliente
            }) 
        }else{
            newPalletEtiquetaCliente.push({
                pallet,
                etiquetaCliente
            })
        }
        setPalletsEtiquetasCliente(newPalletEtiquetaCliente)
        setEtiquetaIngresada(true)
        setPallet("")
        setEtiquetaCliente("")

        } catch(e){
            handleError(e)
        }

    }

    const renderItem = ({ item }) => {


        const backgroundColor = palletsEtiquetasCliente && item.pallet === palletsEtiquetasCliente.pallet && item.etiquetaCliente === palletsEtiquetasCliente.etiquetaCliente ? "#ff0000" : "#e8f0ed";
        const color = palletsEtiquetasCliente && item.pallet === palletsEtiquetasCliente.pallet && item.etiquetaCliente === palletsEtiquetasCliente.etiquetaCliente ? 'white' : 'black';
        return (
          <Item
            item={item}
            onPress={() => setPalletEtiquetaCliente(item)}
            selectedStyle={{backgroundColor, color}}
          />
        );
    }
    const Item = ({ item, onPress, selectedStyle }) => {
    
        const { 
            etiquetaCliente, 
            pallet 
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
                    <View style={viewContenido}>
                        <Text style={{...subtitulo, color: selectedStyle.color}}>ETIQUETA CLIENTE: </Text>      
                        <Text style={{...subtituloValor, color: selectedStyle.color}}>{etiquetaCliente}</Text>          
                    </View>
                    <View style={viewContenido}>
                        <Text style={{...subtitulo, color: selectedStyle.color}}>PALLET: </Text>      
                        <Text style={{...subtituloValor, color: selectedStyle.color}}>{pallet}</Text>          
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return ( 
        <SafeAreaView>
                {palletsEtiquetasCliente.length > 0 &&
                    <View style={{margin: 5}}>
                        <TouchableOpacity
                            style={buttonInputPrimary}
                            color={colores.rojo}
                            onPress={() => {
                                navigation.navigate('PedidoCargaEmbarquePatente',{
                                  pedidoCarga
                                })
                            }}
                        >
                            <Text style={buttonTextPrimary}>
                                EMBARCAR
                            </Text>
                        </TouchableOpacity >
                    </View>
                }
                <View style={{margin: 5}}>
                    <View style={viewContenido}>
                        <Text style={subtitulo}>USUARIO: </Text>      
                        <Text style={subtituloValor}>{codigo_usuario}</Text>          
                    </View>
                    <View style={viewContenido}>
                        <Text style={subtitulo}>PEDIDO: </Text>      
                        <Text style={subtituloValor}>{codigo_pedido_carga}</Text>          
                    </View>
                    <View style={viewContenido}>
                        <Text style={subtitulo}>CLIENTE: </Text>      
                        <Text style={subtituloValor}>{rut_cliente}</Text>          
                    </View>
                </View>
                    <View style={{margin: 5}}>
                        <TextInput
                            style={{...textInputPrimary, textAlign: 'center'}}
                            onChangeText={setPallet}
                            value={pallet}
                            placeholder="PALLET"
                        />
                        <TextInput
                            style={{...textInputPrimary, textAlign: 'center'}}
                            onChangeText={setEtiquetaCliente}
                            value={etiquetaCliente}
                            placeholder="ETIQUETA CLIENTE"
                        />
                        <TouchableOpacity
                            style={buttonInputPrimary}
                            color={colores.rojo}
                            onPress={embarcarPallet} 
                        >
                            <Text style={buttonTextPrimary}>
                                INGRESAR ETIQUETA
                            </Text>
                        </TouchableOpacity >
                    </View>
                <View style={{margin: 5}}>
                    <FlatList
                        data={palletsEtiquetasCliente}
                        renderItem={renderItem}
                    />
                </View> 
        </SafeAreaView>
    );
}


 
export default PedidoCargaEmbarquePallet;