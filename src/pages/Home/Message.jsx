import { useAuth, useSocket, useCurrentRoom } from '../../context/index.js'
import { useState } from 'react'
import noProfile from '../../assets/images/no-profile.png'

const Message = ({message}) => {

    const { auth } = useAuth()
    const { socketState: { socket } } = useSocket()
    const { currentRoom } = useCurrentRoom()

    const [editingMessage, setEditingMessage] = useState(false)

    const [editMessageInputValue, setEditMessageInputValue] = useState('')
 
    const deleteMessage = (messageId) => {
        socket.emit('chat-room/delete-message', {messageId, roomId: currentRoom.room_id})
    }

    const editMessage = (messageId) => {
        if(!editMessageInputValue) return

        socket.emit('chat-room/edit-message', {
            newMessageText: editMessageInputValue,
            messageId: messageId,
            roomId: currentRoom.room_id
        })

        setEditingMessage(false)
    }

    const showEditMessageModal = (oldMessageText) => {
        setEditMessageInputValue(oldMessageText)
        setEditingMessage(true)
    }

    return(
        <>
        <div className="user">
            <img src={noProfile} alt="" className="profile-picture" />
            <span className="username">{message.sender.username}</span>
        </div>
        <div className="message">
            {editingMessage &&
                <div className="edit-message-container">
                    <textarea
                     type="text"
                     defaultValue={editMessageInputValue}
                     onChange={(e) => setEditMessageInputValue(e.target.value)}
                    />
                    <div className="actions">
                        <button
                         disabled={editMessageInputValue ? false : true}
                         className="submit not-button"
                         onClick={() => editMessage(message.message_id)} >submit</button>

                        <button
                         className="cancel not-button"
                         onClick={() => setEditingMessage(false)}>cancel</button>
                    </div>
                </div>}

            <span className="created-at">25/9/10</span>

            {
                message.sender.user_id === auth.userId &&
                <div className="dropdown-container">
                    <span className="dropdown-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <div className="dropdown-menu">
                        <ul>
                            <li>
                                <button
                                    onClick={() => deleteMessage(message.message_id)}
                                    className='delete-message not-button' >
                                    delete message
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => showEditMessageModal(message.message_text)}
                                    className='edit-message not-button' >
                                    edit message
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            }

            <p className="message-text">{message.message_text}</p>
        </div>
        </>
    )
}

export default Message