import axios from 'axios'
import apiConfig from './api.json'

class Rooms {
    constructor(){
        this.axios = axios.create({baseURL: (apiConfig.baseUrl + 'rooms/')})
    }

    async getUserRooms(accessToken){
        return await this.axios.get('/', {
            headers: { 'authorization': 'Bearer ' + accessToken}
        })
    }

    async createRoom(membersIds, accessToken, roomName){
        return await this.axios.post(
            "/",
            {usersIds: membersIds, roomName},
            {headers: { 'authorization': 'Bearer ' + accessToken}}
        )
    }

    async getRoom(roomId, accessToken){
        return await this.axios.get(`/${roomId}`, {headers: { 'authorization': 'Bearer ' + accessToken}})
    }
}

export default new Rooms()