import { useEffect, useState } from 'react'
import { useAuth, useCurrentRoom, useSocket } from '../../context/index.js'
import roomsAPI from '../../api/rooms.js'

const Rooms = ({setShowCreateRoomModal}) => {
    
    const [roomsState, setRoomsState] = useState({rooms: [], isLoading: true})

    // useContext
    const { auth } = useAuth()
    const { setCurrentRoom, currentRoom } = useCurrentRoom()
    const { socketState: { socket } } = useSocket()


    const joinRoom = async (roomId) => {
        if(currentRoom && currentRoom.room_id === roomId) return

        try {
            const {data: { room }} = await roomsAPI.getRoom(roomId, auth.token)
            
            socket.emit('chat-room/submit-current-room', {
                room: {
                    roomId: room.room_id,
                    usersIds: room.users_ids
                },
                userId: auth.userId,
                lastRoomId: currentRoom?.room_id || null
            })

            
            setCurrentRoom(room.room_name, room.room_id, room.users_ids)

            setRoomsState(currentState => {
                return {
                    ...currentState,
                    rooms: currentState.rooms.map(room => {
                        if(roomId === room.room_id){
                            room.notificationsIds = []
                        }
                        return room
                    })
                }
            })


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        if(roomsState.isLoading){
            roomsAPI.getUserRooms(auth.token)
             .then(({data: { rooms }}) => {
                setRoomsState({rooms, isLoading: false})
             })
             .catch(err => {
                console.log(err)
             })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoom.room_id])


    useEffect(() => {

        
        if(!roomsState.isLoading) {
            // update rooms in real time
            socket.on("chat-room/new-room-created", (room) => {
                setRoomsState((currentState) => {
                    return {
                        ...currentState,
                        rooms: [room, ...currentState.rooms]
                    }
                })
            })
            socket.on("chat-room/notification", ({roomId, notificationId}) => {
                setRoomsState(currentState => {
                    return {
                        ...currentState,
                        rooms: currentState.rooms.map(room => {
                            if(room.room_id === roomId){
                                room.notificationsIds.push(notificationId)
                            }

                            return room
                        })
                    }
                })
            })
            return () => {
                socket.removeListener('chat-room/new-room-created')
                socket.removeListener('chat-room/notifications')
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomsState.isLoading])

    


    return (

        <>
        <section className="rooms-container">
            <button onClick={() => setShowCreateRoomModal(true)} className="create-room-btn card not-button">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 0C10.3008 0.0446294 6.76575 1.53395 4.14985 4.14985C1.53395 6.76575 0.0446294 10.3008 0 14C0.0446294 17.6992 1.53395 21.2343 4.14985 23.8501C6.76575 26.466 10.3008 27.9554 14 28C17.6992 27.9554 21.2343 26.466 23.8501 23.8501C26.466 21.2343 27.9554 17.6992 28 14C27.9554 10.3008 26.466 6.76575 23.8501 4.14985C21.2343 1.53395 17.6992 0.0446294 14 0V0ZM22 15H15V22H13V15H6V13H13V6H15V13H22V15Z" fill="white"/>
                </svg>
            </button>
            {
                roomsState.isLoading
                    ?   <h3>Loading...</h3>
                    :   roomsState.rooms.map(room => {
                        return (
                            <div onClick={() => joinRoom(room.room_id)} key={room.room_id} className="room card">
                                <h4 className="title">{room.room_name}</h4>
                                <div className="notifications-container">
                                    { room.notificationsIds.length > 0 && 
                                        <><span></span>
                                        <span className="notifications-count">{room.notificationsIds.length}</span></>
                                    }
                                </div>
                            </div>
                        )
                    })
            }
        </section>
        </>
    )
}

export default Rooms