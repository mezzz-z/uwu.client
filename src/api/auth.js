import axios from 'axios'
import apiConfig from './api.json'

class Auth {
    constructor(){
        this.axios = axios.create({baseURL: (apiConfig.baseUrl + 'auth/')})
    }

    
    login = async (username, password) => {
        return await this.axios.post('/login',
            {
                username,
                password
            },
            {
                withCredentials: true
            }
        )
    }


    signup = async (username, password, email, profilePicture=null) => {
        return await this.axios.post('/signup',
            {
                username,
                password,
                email,
                profilePicture
            }
        )
    }

    logout = async () => {
        return await this.axios.post('/logout', {withCredentials: true})
    }

    refreshToken  = async () => {
        return await this.axios.post('/refresh_token', {}, { withCredentials: true })
    }
}

export default new Auth()