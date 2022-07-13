import { useAuth, useSocket, useCurrentRoom } from '../../context/index.js'
import noProfile from '../../assets/images/no-profile.png'

const Message = ({message}) => {

    const { auth } = useAuth()
    const { socketState: { socket } } = useSocket()
    const { currentRoom } = useCurrentRoom()
 
    const deleteMessage = (messageId) => {
        socket.emit('chat-room/delete-message', {messageId, roomId: currentRoom.room_id})
    }

    const editMessage = (messageId) => {
    }

    return(
        <>
        <div className="user">
            <img src={noProfile} alt="" className="profile-picture" />
            <span className="username">{message.sender.username}</span>
        </div>
        <div className="message">
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
                                    onClick={() => editMessage(message.message_id)}
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