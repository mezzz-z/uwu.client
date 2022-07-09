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

    async getUser(filter) {
        return await this.axios.get(`/${Object.keys(filter)[0]}/${Object.values(filter)[0]}`)
    }

    async getUserFriends(accessToken) {
        return await this.axios.get('/current/friendRequests', {
            withCredentials: true,
            headers: {"authorization": "Bearer " + accessToken}
        })
    }

}

export default new Users()