import { useState, useContext } from "react"
import friendsAPI from '../../api/friends.js'
import usersAPI from '../../api/users.js'
import {authContext} from '../../context/index.js'
import useFormModal from '../../hooks/useFormModal'
import FormModal from '../../components/FormModal'

const SearchBar = () => {

    const [username, setUsername] = useState('')

    const { auth: {token} } = useContext(authContext)
    const {modalState: modal, removeModal, setModal} = useFormModal()


    const sendFriendRequest = async () => {
        if(!username) return

        try {
            const { data: userData } = await usersAPI.getUser({username})
            if(!userData) return
            const { data: friendRequestResultData } = await friendsAPI.sendFriendRequest(userData.user.user_id, token)
            setModal(friendRequestResultData.message, true)
            
        } catch (err) {
            if(!err.response.data) return setModal(err.message, false)
            setModal(err.response.data.message, false)
        }
    }

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