import { useEffect, useContext, useState, useRef } from 'react'
import { currentRoomContext, socketContext, authContext } from '../../context/index.js'
import noProfile from '../../assets/images/no-profile.png'


// TODO: limit messages to fetch
// TODO: load more messages on firstMessage.current.scrollIntoView


const ChatScreen = () => {

    // useContext
    const { currentRoom, addNewMessage } = useContext(currentRoomContext)
    const { auth } = useContext(authContext)
    const { socketState: {socket} } = useContext(socketContext)


    const scrollSpan = useRef(null)


    const [messageText, setMessageText] = useState('')

    const sendMessage = async (e) => {
        e.preventDefault()
        socket.emit("chat-room/new-message", ({
            roomId: currentRoom.room_id,
            messageText,
            senderId: auth.userId
        }))
        setMessageText('')
    }
    
    useEffect(() => {
        socket.on("chat-room/new-message", (message) => {
            addNewMessage(message)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        scrollSpan.current.scrollIntoView({ behavior: "smooth" });
    }, [currentRoom.messages])

    return (

            <section className="chat-screen">
                <header className="header">
                    <h3 className="room-name">{currentRoom.room_name}</h3>
                    <button className="room-info not-button">room info</button>
                </header>
                <div className="main-container">
                    { currentRoom.messages.length > 0 
                        ?  currentRoom.messages.map((message) => {
                                return(
                                    <div
                                     key={message.message_id}
                                     itsme={message.sender.sender_id === auth.userId ? 'true' : 'false'}
                                     className="message-container">

                                        <div className="user">
                                            <img src={noProfile} alt="" className="profile-picture" />
                                            <span className="username">{message.sender.username}</span>
                                        </div>
                                        <div className="message">
                                            <span className="created-at">25/9/10</span>
                                            <div className="dropdown-container">
                                                <span className="dropdown-icon">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </span>
                                            </div>
                                            <p className="message-text">{message.message_text}</p>
                                        </div>
                                    </div>
                                )
                            })

                        :   <h3 className="no-messages">There is no messages</h3>
                    }

                    <span ref={scrollSpan} style={{display: 'inline'}}></span>
                </div>
                <article className="footer">
                    <form onSubmit={sendMessage} action="">
                        <input required value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="write something" type="text" />
                        <button disabled={messageText ? false : true} type="submit">send</button>
                    </form>
                </article>
            </section>
    )
}

export default ChatScreen 