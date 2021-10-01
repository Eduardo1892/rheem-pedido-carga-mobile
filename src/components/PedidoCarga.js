import React, {useContext, useState, useEffect} from 'react'
import { Alert, FlatList, SafeAreaView, Text,  TouchableOpacity, View } from "react-native"
import { Picker } from '@react-native-picker/picker';
import AuthContext from '../context/auth/AuthContext';
import clienteAxios from '../config/axios';
import { handleError } from '../helpers';
import { 
        colores, 
        buttonInputPrimary,
        buttonTextPrimary, 
        picker, 
        pickerItem,
        titulo,
        subtitulo,
        subtituloValor,
        itemFlatList,
        viewContenido,
    } from '../styles/AppStyles';

const PedidoCarga = ({navigation}) => {

    //valores del picker 
    const [selectedEstado, setSelectedEstado] = useState(0);
    //valor seleccionado en la lista
    const [codigoPedidoCarga, setCodigoPedidoCarga] = useState(null);
    //estados del combobox
    const [estados, setEstados] = useState([])
    //variables globales
    const { usuario, rol } = useContext(AuthContext)

    const [pedidosCarga, setPedidosCarga] = useState([
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            title: "First Item",
          },
          {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
            title: "Second Item",
          },
          {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
          },
    ])
    
    useEffect(() => {
        listarEstados()
    }, [rol])
    
    useEffect(() => {
        listarPedidosCargaUsuarioEstado()
    }, [selectedEstado])

    const listarEstados = async () => {
        try{

            let resp = await clienteAxios.get('/api/rol-estados/listar',{
                params:{
                    codigoRol: rol.codigo
                }
            })
            setEstados(resp.data.rolEstados)
        } catch(e){
            handleError(e)
        }
    }

    const listarPedidosCargaUsuarioEstado = async () => {
        try{

            let resp = await clienteAxios.get('/api/pedido-carga/listar-pedidos-carga-estado-usuario',{
                params:{
                    codigoEstado: selectedEstado,
                    codigoUsuario: usuario.codigo
                }
            })
            setPedidosCarga(resp.data.pedidoCarga)
        } catch(e){
            handleError(e)
        }
    }

    const handleSelectPickerEstado = (itemValue) => {
        setSelectedEstado(itemValue)
        setCodigoPedidoCarga(null)
    }

    const renderItem = ({ item }) => {

        const backgroundColor = codigoPedidoCarga && item.codigo_pedido_carga === codigoPedidoCarga ? "#ff0000" : "#e8f0ed";
        const color = codigoPedidoCarga && item.codigo_pedido_carga === codigoPedidoCarga ? 'white' : 'black';
    
        return (
          <Item
            item={item}
            onPress={() => setCodigoPedidoCarga(item.codigo_pedido_carga)}
            selectedStyle={{backgroundColor, color}}
          />
        );
    }

    const Item = ({ item, onPress, selectedStyle }) => {
 
        const {
            codigo_pedido_carga, 
            rut_cliente, 
            nombre_cliente, 
            fecha, 
            orden_compra, 
            orden_venta
        } = item

        return(
            <TouchableOpacity 
                key={codigo_pedido_carga}
                onPress={onPress} 
                style={{
                    ...itemFlatList, 
                    backgroundColor: selectedStyle.backgroundColor, 
                }}
            >
            <View>
                <View>
                    <Text numberOfLines={1} style={{...titulo, color: selectedStyle.color}}>{nombre_cliente}</Text>                
                </View>
                <View style={viewContenido}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>RUT: </Text>      
                    <Text style={{...subtituloValor, color: selectedStyle.color}}>{rut_cliente}</Text>          
                </View>
                <View style={viewContenido}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>FECHA HORA: </Text>
                    <Text style={{...subtituloValor, color: selectedStyle.color}}>{fecha}</Text>
                </View>
                <View style={viewContenido}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>N° PEDIDO: </Text>
                    <Text style={{...subtituloValor, color: selectedStyle.color}}>{codigo_pedido_carga}</Text>
                </View>
                <View style={viewContenido}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>N° ORDEN COMPRA: </Text>
                    <Text style={{...subtituloValor, color: selectedStyle.color}}>{orden_compra}</Text>
                </View>
                <View style={viewContenido}>
                    <Text style={{...subtitulo, color: selectedStyle.color}}>N° ORDEN VENTA: </Text>
                    <Text style={{...subtituloValor, color: selectedStyle.color}}>{orden_venta}</Text>
                </View>
            </View>
            </TouchableOpacity>
        )
    }

    return ( 
        <SafeAreaView>
            <View style={{margin: 5}}>
                <View style={viewContenido}>
                    <Text style={subtitulo}>CÓDIGO: </Text>      
                    <Text style={subtituloValor}>{usuario.codigo}</Text>          
                </View>
                <View style={viewContenido}>
                    <Text style={subtitulo}>NOMBRE: </Text>      
                    <Text style={subtituloValor}>{usuario.nombre.toUpperCase()}</Text>          
                </View>
                <View style={viewContenido}>
                    <Text style={subtitulo}>PERFIL: </Text>      
                    <Text style={subtituloValor}>{rol.descripcion}</Text>          
                </View>
                <View style={viewContenido}>
                    <Text style={subtitulo}>FECHA: </Text>      
                    <Text style={subtituloValor}>{new Date().toISOString().split('T')[0]}</Text>          
                </View>
            </View>
            <View style={{margin: 5}}>
                <TouchableOpacity
                    style={buttonInputPrimary}
                    color={colores.rojo}
                    onPress={() => { 
                        if(!codigoPedidoCarga){
                            Alert.alert('INFO','DEBE SELECCIONAR UN PEDIDO')
                            return
                        }
                        navigation.navigate('PedidoCargaDetalle',{
                            codigoPedidoCarga
                        })
                        setSelectedEstado(0)                          
                    }} 
                >
                    <Text style = {buttonTextPrimary}>
                        VER PEDIDO
                    </Text>
                </TouchableOpacity >
            </View>
            <View style={{margin: 5}}>
                <Picker
                    selectedValue={selectedEstado} 
                    onValueChange={handleSelectPickerEstado}
                    style={picker}
                >
                    <Picker.Item 
                        label={"SELECCIONE ESTADO"} 
                        value={0} 
                        style={pickerItem}
                    /> 
                    {estados.map((item, index) => {
                        return <Picker.Item 
                                    key={item.estado.codigo}
                                    label={item.estado.descripcion.toUpperCase()} 
                                    value={item.estado.codigo} 
                                    style={pickerItem}
                                />
                    })}
                </Picker>
            </View>
            <View style={{margin: 5}}>
                <FlatList
                    data={pedidosCarga}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
     )
}
 
export default PedidoCarga;