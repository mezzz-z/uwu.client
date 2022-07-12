import { useEffect, useState, useRef } from 'react'
import { useAuth, useSocket } from '../../context/index.js'
import useModalWrapper from '../../components/ModalWrapper/hook.js'
import roomsAPI from '../../api/rooms.js'
import FormModalComp from '../../components/FormModal.jsx'
import useFormModal from '../../hooks/useFormModal.js'


const AddUserToRoom = ({userId}) => {

    const { auth: { token } } = useAuth()
    const { socketState: { socket } } = useSocket()
    const { hideModal } = useModalWrapper()

    const [rooms, setRooms] = useState([])
    const [awaitFetchRooms, setAwaitFetchRooms] = useState(true)

    const scrollUpSpan = useRef(null)

    const {
        removeModal: removeFormModal,
        setModal: setFormModal,
        modalState: formModalState,
    } = useFormModal()

    const loadRooms = async () => {
        try {
            const { data } = await roomsAPI.getUserRooms(token)
            setRooms(data.rooms)
            setAwaitFetchRooms(false)
        } catch (error) {
            console.log(error)
        }
    }

    const addUser = (roomId) => {
        if(formModalState.openModal) return
        socket.emit('chat-room/add-new-user', ({userId, roomId, accessToken: token}))
    }

    const newUserAddedCallback = ({message, success}) => {
        if(success){
            setFormModal(message, true, () => {hideModal()})
        } else {
            setFormModal (message, false)
        }
    
        scrollUpSpan.current.scrollIntoView({ behavior: "smooth" })

    }

    useEffect(() => {

        loadRooms()

        socket.on('chat-room/new-user-added', newUserAddedCallback)

        return () => {
            socket.removeListener('chat-room/new-user-added')
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        awaitFetchRooms
         ? <h3 className="loading">Loading ...</h3>
         :  <>
                <span ref={scrollUpSpan} style={{display: 'inline'}}></span>
                <section className="add-user-to-room">
                        {formModalState.openModal &&
                            <>
                                <FormModalComp
                                modalClassName={formModalState.modalClassName}
                                modalContent={formModalState.content}
                                removeModal={removeFormModal} />
                                <span className="cover"></span>
                            </>
                        }
                        <h3 className="title">Select a room</h3>
                        <div className="rooms">
                            {rooms.map(room => {
                                return (
                                    <button
                                    onClick={() => addUser(room.room_id)}
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
            </>
    )
}
export default AddUserToRoom