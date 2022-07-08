
import React, { useContext, useState } from 'react'
import { useUser, authContext, socketContext } from '../../context/index'
import noProfileImg from '../../assets/images/no-profile.png'
import useFormModal from '../../hooks/useFormModal.js'
import roomsAPI from '../../api/rooms.js'
import Modal from '../../components/FormModal.jsx'
import modalWrapperContext from '../../components/ModalWrapper/context'

const CreateRoom = () => {

    // useContext
    const { userState: { friends } } = useUser()
    const { socketState: {socket} } = useContext(socketContext)
    const { auth } = useContext(authContext)
    const { hideModal } = useContext(modalWrapperContext)

    const [roomName, setRoomName] = useState('')
    const [filter, setFilter] = useState('')
    const [selectedFriendsIds, setSelectedFriendsIds] = useState([])
    const [currentPageIndex, setCurrentPageIndex] = useState(0)

    const {modalState, setModal, removeModal} = useFormModal()

    const handleCheckboxInputs = (e) => {
        const currentFriendId = e.target.id

        if(!e.target.checked){
            return setSelectedFriendsIds([
                ...selectedFriendsIds.filter(friendId => friendId !== currentFriendId)
            ])
        }

        setSelectedFriendsIds([...selectedFriendsIds, currentFriendId])
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(!roomName) return setModal('Fields cannot be empty', false)
         
        try {
            const { data: {createdRoom: room, message} } = await roomsAPI.createRoom(selectedFriendsIds, auth.token, roomName)
            
            socket.emit('chat-room/new-room-created', room)
            setModal(message, true)

            setTimeout(() => {
                hideModal()
            }, 2000)

            
        } catch (err) {
            console.log(err)
            const errMessage = err.response?.data.message || 'Something went wrong'
            setModal(errMessage, false)
        }
    }


    const pages = [
        // page 1
        <section className="page1 select-friends">
            <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder='who would you like to add ?' />
            {friends.length > 0 
                ?   <div className="friends">
                        {friends.map(friend => {
                            // return null if username is not the username we are looking htmlFor
                            if(filter && friend.username.indexOf(filter) === -1) return null

                                        
                            return (
                                <div key={friend.user_id} className='friend-container'>
                                    <input
                                    onChange={handleCheckboxInputs}
                                    type="checkbox"
                                    id={friend.user_id}
                                    defaultChecked={
                                        selectedFriendsIds.includes(friend.user_id) ? true : false
                                    } />

                                    <label htmlFor={friend.user_id} className="friend">
                                        <img src={friend.profile_picture || noProfileImg} alt="" className="profile-picture" />
                                        <span className="username">{friend.username}</span>
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                :   <h3> You have no friends</h3>}
        </section>,

        // page 2
        <section className="page2 create-the-room">
            


            <form onSubmit={handleSubmit} action="">

                {modalState.openModal && <Modal
                        modalContent={modalState.content}
                        removeModal={removeModal}
                        modalClassName={modalState.modalClassName}
                />}
                <div className="members-list">
                <span className="member-list-title" />
                <span className="member member-you">YOU</span>
                
                {selectedFriendsIds.map(id => {
                    const {username} = friends.find(friend => friend.user_id === id);
                    return (
                        <React.Fragment key={id}>
                        , <span className="member">{username}</span>
                        </React.Fragment>
                        )
                    })}
                </div>

                <input value={roomName} onChange={(e) => setRoomName(e.target.value)} type="text" placeholder="Room name" />
                <input type="submit" value="Create" />
                
            </form>

            
        </section>
    ]

    return (
        <>
            <div className="create-room-container">         
                {pages[currentPageIndex]}
                <button disabled={currentPageIndex === (pages.length - 1) ? true : false} onClick={() => setCurrentPageIndex(currentPageIndex + 1)} className="next not-button">next</button>
                <button disabled={currentPageIndex === 0} onClick={() => setCurrentPageIndex(currentPageIndex - 1)} className="back not-button">back</button>
            </div>
        </>
    )
}

export default CreateRoom