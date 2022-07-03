import { useState } from 'react'
import CurrentRoomContext from './current-room-context.js'

const CurrentRoomState = (props) => {

    const [ currentRoomState, setCurrentRoomState ] = useState({
        messages: null,
        users_ids: [],
        room_name: '',
        room_id: '',
    })

    const setCurrentRoom = (messages, roomName, roomId, roomUsers) => {
        setCurrentRoomState({
            ...currentRoomState,
            messages: messages,
            room_name: roomName,
            room_id: roomId,
            users_ids: roomUsers,
            submitted: false
        })
    }

    const addNewMessage = (message) => {
        setCurrentRoomState(state => {
            return {
                ...state,
                messages: [...state.messages, {
                    message_id: message.message_id,
                    created_at: message.created_at,
                    message_text: message.message_text,
                    sender: {
                        sender_id: message.sender_id,
                        profile_picture: message.profile_picture,
                        username: message.username
                    }
                }]
            }
        })
    }

    const submitCurrentRoom = () => {
        setCurrentRoomState({...currentRoomState, submitted: true})
    }

    return (
        <CurrentRoomContext.Provider value={{
            currentRoom: currentRoomState,
            setCurrentRoom: setCurrentRoom,
            submitCurrentRoom: submitCurrentRoom,
            addNewMessage: addNewMessage
        }}>

            {props.children}

        </CurrentRoomContext.Provider>
    )
}

export default CurrentRoomState