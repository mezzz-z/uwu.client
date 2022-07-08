import { useState } from "react"
import usersAPI from '../../api/users.js'
import { useAuth, useSocket } from '../../context/index.js'
import useFormModal from '../../hooks/useFormModal'
import FormModal from '../../components/FormModal'
import { useEffect } from "react"

const SearchBar = () => {

    const [username, setUsername] = useState('')

    const { auth: { token } } = useAuth()
    const { modalState: modal, removeModal, setModal } = useFormModal()
    const { socketState: { socket } }  = useSocket()


    const sendFriendRequest = async () => {
        if(!username) return

        
        try {
            const { data } = await usersAPI.getUser({username})
            socket.emit('friends/send-friend-request', {receiverId: data.user.user_id, accessToken: token})
            
        } catch (err) {
            if(!err.response.data) return setModal(err.message, false)
            setModal(err.response.data.message, false)
        }
    }

    useEffect(() => {
        socket.on('friends/friend-request-sent', ({success, message}) => {
            setModal(message, success)
            
        })

        return () => {
            socket.removeListener('friends/friend-request-sent')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        <article className="search-bar-container">                    
            {modal.openModal && <FormModal
                modalClassName={modal.modalClassName}
                modalContent={modal.content}
                removeModal={removeModal}
            />}
            <input
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             type="text"
             placeholder="Find a new friend" />

            <button onClick={sendFriendRequest} className="submit-button">send</button>
        </article>
        </>
    )
}

export default SearchBar