import { useEffect, useState } from 'react'
import { useAuth } from '../../context/index.js'
import roomsAPI from '../../api/rooms.js'


const AddUserToRoom = ({userId}) => {

    const { auth: { token } } = useAuth()

    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const loadRooms = async () => {
        try {
            const { data } = await roomsAPI.getUserRooms(token)
            setRooms(data.rooms)
            console.log(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    // const joinUserToRoom = () => {

    // }

    useEffect(() => {
        loadRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        isLoading
         ? <h3 className="loading">Loading ...</h3>
         : <section className="add-user-to-room">
                <h3 className="title">Select a room</h3>
                <div className="rooms">
                    {rooms.map(room => {
                        return (
                            <button
                             key={room.room_id}
                             className="room not-button"
                             disabled={room.users_ids.includes(userId) ? true : false }
                             >
                             
                                <span className="room-name">{room.room_name}</span>
                            </button>
                        )
                    })}
                </div>
           </section>
    )
}
export default AddUserToRoom