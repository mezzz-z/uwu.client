/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { useSocket, useAuth, useCurrentRoom } from '../../context/index.js'
import roomsAPI from '../../api/rooms.js'
import Message from './Message.jsx'

const ChatRoom = () => {

    const { currentRoom, addNewMessage, setMessages, removeMessage } = useCurrentRoom()
    const { auth } = useAuth()
    const { socketState: {socket} } = useSocket()

    const firstMessage = useRef(null)
    const scrollSpan = useRef(null)
    const observer = useRef(null)
    const newMessage = useRef(false)

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if(!entry.target.id === 'firstMessage' || !entry.isIntersecting) return
            roomsAPI.getRoomMessages(currentRoom.room_id, auth.token, currentRoom.messages.length)
            .then(({data}) => {setMessages(data.messages, data.isFinished, false)})
            .catch(error => console.log(error))
        });
    }

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

    const deleteMessage = () => {
        console.log('woo')
    }
    
    const editMessage = () => {
        console.log('woo')
    }

    useEffect(() => {
        roomsAPI.getRoomMessages(currentRoom.room_id, auth.token)
         .then(({data}) => {
            newMessage.current = true
            setMessages(data.messages, data.isFinished)
        })
         .catch(error => console.log(error))

        socket.on("chat-room/new-message", (message) => {
            newMessage.current = true
            addNewMessage(message)
        })
        socket.on("chat-room/message-deleted", (messageId) => {
            console.log(messageId)
            removeMessage(messageId)
        })

        return () => {
            socket.removeListener('chat-room/new-message')
        }
    }, [currentRoom.room_id])



    useEffect(() => {
        if(currentRoom.awaitFetchMessages) return

        if(newMessage.current) {
            scrollSpan.current.scrollIntoView({ behavior: "smooth" })
            newMessage.current = false
        }
        
        if(currentRoom.areMessagesFinished) {
            if(observer.current) observer.current.disconnect()
            return
        }
        
        setTimeout(() => {
            observer.current = new IntersectionObserver(observerCallback, {rootMargin: '-100px 0px 0px -100px'})
            observer.current.observe(firstMessage.current)
        }, 1000)

        return () => {
            if(observer.current) observer.current.disconnect()
        }

    }, [currentRoom.messages])

    return (

            <section className="chat-screen">
                <header className="header">
                    <h3 className="room-name">{currentRoom.room_name}</h3>
                    <button className="room-info not-button">room info</button>
                </header>
                <div className="main-container">
                    {currentRoom.awaitFetchMessages 
                        ? <h3 className="no-messages">Loading...</h3>
                        : currentRoom.messages.length > 0 
                            ?  currentRoom.messages.map((message, i) => {
                                return ( 
                                    <div
                                     ref={i === 0 ? firstMessage : undefined}
                                     key={message.message_id}
                                     itsme={message.sender.user_id === auth.userId ? 'true' : 'false'}
                                     className="message-container"
                                     id={message.i === 0 ? 'firstMessage' : undefined} >

                                        <Message message={message}/>
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

export default ChatRoom 