import AuthContext from './auth-context.js'
import authReducer from './auth-reducer.js'
import { useReducer } from 'react'
import {IS_REFRESHING, LOGGED_IN, LOGGED_OUT, IS_MODAL_OPEN} from './auth-actions'
import authAPI from '../../api/auth.js'

const AuthState = (props) => {
    const [state, dispatch] = useReducer(authReducer, {
        isLoggedIn: false,
        token: '',
        isRefreshing: true,
        userId: '',
        isModalOpen: false
    }) 
    const loggedIn = (token, userId) => {
        dispatch({type: LOGGED_IN, payload: {token, userId}})
    }

    const loggedOut = () => {
        dispatch({type: LOGGED_OUT})
    }

    const refreshToken = async (errCallback=null) => {
        dispatch({type: IS_REFRESHING, payload: true})
        
        try {
            const {data: { accessToken, userId }} = await authAPI.refreshToken()
            loggedIn(accessToken, userId)
    
        } catch (error) {

            // logout and invoke the callback
            loggedOut()
            if(!errCallback || typeof errCallback !== 'function') return
            errCallback()
        }
    }

    const setIsModalOpen = (bool) => {
        dispatch({type: IS_MODAL_OPEN, payload: bool})
    }

    return (
        <AuthContext.Provider value={{
            auth: state,
            loggedIn,
            loggedOut,
            refreshToken,
            setIsModalOpen
        }}>

            {props.children}

        </AuthContext.Provider>
    )
}

export default AuthState