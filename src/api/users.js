import axios from 'axios'
import apiConfig from './api.json'

class Users {
    constructor(){
        this.axios = axios.create({baseURL: (apiConfig.baseUrl + 'users/')})
    }
    async getCurrentUser(accessToken){
        return await this.axios.get('/current', {
            withCredentials: true,
            headers: {
                'authorization': 'Bearer ' + accessToken
            }
        })
    }
}

export default new Users()