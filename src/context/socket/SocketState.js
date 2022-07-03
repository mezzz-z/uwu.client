import SocketContext from './socket-context.js'
import {
    CONNECTION_CREATED,SUBMIT_USER_ID,
    SUBMIT_CURRENT_ROOM,
    EVENT_LISTENERS_CONFIGURED,
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
    const {socket} = socketState

    const createConnection = (targetUrl) => {
        const socket = io(targetUrl)
        socket.on('connect', () => {
            console.log('socket io connection was successfully')
            dispatch({type: CONNECTION_CREATED, payload: socket})
        })
    }
    
    const configEventListeners = () => {


        // on userId submitted
        socket.on('global/user-id-submitted', (userId) => {
            dispatch({type: SUBMIT_USER_ID})
            console.log(`user submitted, id(${userId})`)
        })

        // on currentRoom submitted
        socket.on('chat-room/current-room-submitted', (room) => {
            dispatch({type: SUBMIT_CURRENT_ROOM})
            console.log(`current room submitted, id(${room.roomId})`)
        })

        socket.on('video-call/incoming-invite', ({senderId, invitationCode}) => {

            console.log(senderId)
            console.log(invitationCode)
            
            dispatch({type: SET_INVITATION, payload: {
                senderId,
                invitationCode
            }})
        })

        dispatch({type: EVENT_LISTENERS_CONFIGURED})
    }

    const submitUserId = (userId) => {
        socket.emit('global/submit-user-id', userId)

    }

    const submitCurrentRoom = (room, userId, lastRoomId) => {
        socket.emit('chat-room/submit-current-room', {room, userId, lastRoomId})
    }

    const clearInvitation = () => {
        dispatch({type: CLEAR_INVITATION})
    }

    return (
        <SocketContext.Provider value={{
            createConnection,
            submitCurrentRoom,
            submitUserId,
            configEventListeners,
            clearInvitation,
            socketState
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketState