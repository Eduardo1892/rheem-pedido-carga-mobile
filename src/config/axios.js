import axios from 'axios'

const clienteAxios = axios.create({
    baseURL : "http://192.168.1.95:3000"
})

export default clienteAxios