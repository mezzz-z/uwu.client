import axios from 'axios'
import apiConfig from './api.json'

class Friends {
    constructor(){
        this.axios = axios.create({baseURL: (apiConfig.baseUrl + 'friends/')})
    }

    async getUserFriends(accessToken){
        return await this.axios.get('/', {
            headers: {
                'authorization': 'Bearer ' + accessToken
            }
        })
    }
}

export default new Friends()