import React from 'react';
import{Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/components/Login';
import PedidoCarga from './src/components/PedidoCarga';
import PedidoCargaDetalle from './src/components/PedidoCargaDetalle';
import PedidoCargaPallet from './src/components/PedidoCargaPallet';
import AuthState from './src/context/auth/AuthState';
import PedidoCargaCantidad from './src/components/PedidoCargaCantidad';
import PedidoCargaSeries from './src/components/PedidoCargaSeries';
import PedidoCargaEmbarquePatente from './src/components/PedidoCargaEmbarquePatente';
import PedidoCargaEmbarquePallet from './src/components/PedidoCargaEmbarquePallet';
import PedidoCargaPalletDetalle from './src/components/PedidoCargaPalletDetalle';



const Stack = createNativeStackNavigator()

{/* <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Iniciar Sesión', handerShown: false}}
        />
        <Stack.Screen
          name="PedidoCarga"
          component={PedidoCarga}
          options={{ title: 'Pedido Carga', handerShown: false}}
        />
        <Stack.Screen
          name="PedidoCargaDetalle"
          component={PedidoCargaDetalle}
          options={{ title: 'Pedido Carga Detalle', handerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer> */}


const App = () => {

  return (
    <AuthState>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'INICIAR SESIÓN', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCarga"
            component={PedidoCarga}
            options={{ title: 'PEDIDO CARGA', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaDetalle"
            component={PedidoCargaDetalle}
            options={{ title: 'PRODUCTOS', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaPallet"
            component={PedidoCargaPallet}
            options={{ title: 'ARMAR PALLET', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaCantidad"
            component={PedidoCargaCantidad}
            options={{ title: 'INGRESO POR CANTIDAD', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaSeries"
            component={PedidoCargaSeries}
            options={{ title: 'INGRESO POR N° SERIE', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaEmbarquePatente"
            component={PedidoCargaEmbarquePatente}
            options={{ title: 'Embarque producto', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaEmbarquePallet"
            component={PedidoCargaEmbarquePallet}
            options={{ title: 'Embarque producto', handerShown: false}}
          />
          <Stack.Screen
            name="PedidoCargaPalletDetalle"
            component={PedidoCargaPalletDetalle}
            options={{ title: 'Detalle pallet', handerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthState>
    
  );
};

export default App;
