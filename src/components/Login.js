import { Picker } from '@react-native-picker/picker';
import React, {useContext, useState, useEffect} from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import clienteAxios from '../config/axios';
import AuthContext from '../context/auth/AuthContext';
import { handleError } from '../helpers';
import {  
    buttonInputPrimary, 
    buttonTextPrimary,
    colores, 
    textInputPrimary, 
    picker, 
    pickerItem } from '../styles/AppStyles';


const Login = ({navigation}) => {
    
    const [codigo, setCodigo] = useState("18999799k");
    const [clave, setClave] = useState("123456");
    const [roles, setRoles] = useState([]);

    const [selectedRol, setSelectedRol] = useState(0);
    const { autenticado, iniciarSesion, cerrarSesion } = useContext(AuthContext)


    useEffect(() => {
        
        if(autenticado){
            navigation.navigate('PedidoCarga')
        }

    }, [autenticado])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          cerrarSesion()
          // Call any action
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation])

    const listarRolesUsuario = async () => {

        try{

            let resp = await clienteAxios.get('/api/usuario-roles/listar',{
                params:{
                    codigoUsuario: codigo
                }
            })
            setRoles(resp.data.usuarioRoles)
            console.log(resp.data.usuarioRoles)
        } catch(e){
            handleError(e)
        }

    }

    const handleClickAutenticarUsuario = async () => {

        if(codigo.trim() === ""){
            Alert.alert('INFO', 'INGRESE CÓDIGO')
            return
        }

        if(clave.trim() === ""){
            Alert.alert('INFO', 'INGRESE CLAVE')
            return
        }

        if(selectedRol === 0){
            Alert.alert('INFO', 'DEBE SELECCIONAR UN PERFIL')
            return
        }

        iniciarSesion(codigo, clave, selectedRol)
        
    }


    return ( 
        <SafeAreaView>
            <View style={{margin: 5}}>
                <TextInput
                    style={textInputPrimary}
                    onChangeText={setCodigo}
                    onBlur={listarRolesUsuario}
                    value={codigo}
                    placeholder="Código"
                />
            </View>
            <View style={{margin: 5}}>
                <TextInput
                    style={textInputPrimary}
                    onChangeText={setClave}
                    value={clave}
                    placeholder="Clave"
                    secureTextEntry={true}
                />
            </View>
            <View style={{margin: 5}}>
                <Picker
                    selectedValue={selectedRol}
                    style={picker}
                    onValueChange={(itemValue, itemIndex) => setSelectedRol(itemValue)}
                >
                    <Picker.Item label={"SELECCIONE PERFIL"} value={0} style={pickerItem}/>   
                    {roles.map((item, index) => {
                        return <Picker.Item 
                                    key={item.rol.codigo} 
                                    label={item.rol.descripcion.toUpperCase()} 
                                    value={item.rol.codigo} 
                                    style={pickerItem}
                                />
                    })}
                </Picker>
            </View>
            <View style={{margin: 5}}>
                <TouchableOpacity
                    style={buttonInputPrimary}
                    color={colores.rojo}
                    onPress={handleClickAutenticarUsuario} 
                >
                    <Text style = {buttonTextPrimary}>
                        INGRESAR
                    </Text>
                </TouchableOpacity >
            </View>
        </SafeAreaView>
     );
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
});
 
export default Login;