import SocketContext from './socket-context.js'
import {
    CONNECTION_CREATED,SUBMIT_USER_ID,
    SUBMIT_CURRENT_ROOM,
    SET_INVITATION, CLEAR_INVITATION } from './socket-actions'
    
import socketReducer from './socket-reducer.js'
import { useReducer } from 'react'
import { io } from 'socket.io-client'


const socketInitial = {
    socket: null,
    isConnected: false,
    submittedList: {
        userId: false,
        currentRoom: false
    },
    configured: false,
    invitation: null
}

const SocketState = ({children}) => {

    const [socketState, dispatch] = useReducer(socketReducer, socketInitial)

    const createConnection = (targetUrl) => {
        const socket = io(targetUrl)
        socket.on('connect', () => {
            console.log('socket io connection was successfully')
            dispatch({type: CONNECTION_CREATED, payload: socket})
        })
    }

    const submitUserId= () => {
        dispatch({type: SUBMIT_USER_ID})
    }

    const submitCurrentRoom = () => {
        dispatch({type: SUBMIT_CURRENT_ROOM})
    }

    const clearInvitation = () => {
        dispatch({type: CLEAR_INVITATION})
    }

    const createInvitation = (senderId, invitationCode) => {
        dispatch({type: SET_INVITATION, payload: {
            senderId,
            invitationCode
        }})
    }

    return (
        <SocketContext.Provider value={{
            createConnection,
            clearInvitation,
            createInvitation,
            submitUserId,
            submitCurrentRoom,
            socketState
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketState