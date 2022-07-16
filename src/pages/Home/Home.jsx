import Friends from './Friends.jsx'
import FriendRequests from './FriendRequests'
import Rooms from './Rooms.jsx'
import ChatRoom from './ChatRoom.jsx'
import { useState, useRef } from 'react'
import { useCurrentRoom, useSocket, useUser, useAuth } from '../../context/index.js'
import CreateRoom from './CreateRoom.jsx'
import ModalWrapper from '../../components/ModalWrapper/ModalWrapper.jsx'
import usersAPI from '../../api/users.js'
import { useEffect } from 'react'
import VideoCallInvitation from './Invitation.jsx'
import SearchBar from './SearchBar.jsx'
import AddUserToRoom from './AddUserToRoom.jsx'


const Home = () => {

    const [currentSidebarComponent, setCurrentSidebarComponent] = useState('friends')
    const currentActiveComponent = useRef()

    // modals States
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
    const [showAddUserToRoomModal, setShowAddUserToRoomModal] = useState({showModal: false, userId: ''}) 

    // useContext
    const { currentRoom } = useCurrentRoom()
    const { setUser, userState } = useUser()
    const { socketState, clearInvitation, createInvitation, submitCurrentRoom } = useSocket()
    const { auth } = useAuth()

    const toggleComponents = (e) => {
        currentActiveComponent.current.classList.remove('active')
        
        setCurrentSidebarComponent(e.target.dataset.component)
        currentActiveComponent.current = e.target
        currentActiveComponent.current.classList.add('active')
    }

    useEffect(() => {
        if(!userState) {
            // get current user information
            usersAPI.getCurrentUser(auth.token)
             .then(({data: {user}}) => {
                setUser(user.username, user.email, user.profile_picture)
             })
             .catch(err => console.log(err))
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketState.invitation])


    // set socket event listeners
    useEffect(() => {
        const {socket} = socketState

        socket.on('video-call/incoming-invite', ({senderId, invitationCode}) => {
            createInvitation(senderId, invitationCode)
        })

        socket.on('chat-room/current-room-submitted', (room) => {
            submitCurrentRoom()
            console.log(`current room submitted, id(${room.roomId})`)
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main id="home" className="container">
            <section className="sidebar">

                <SearchBar />

                <article className="sidebar-components-container">
                    
                    <nav className="nav-bar">
                        <ul className="nav-item-list">
                            <li className="nav-item">
                                <button
                                 ref={currentActiveComponent}
                                 onClick={toggleComponents}
                                 data-component="friends"
                                 className="not-button active">
                                    friends
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                 onClick={toggleComponents}
                                 data-component="rooms"
                                 className="not-button">
                                    rooms
                                </button>
                            </li>
                            <li className="nav-item nav-item-friend-requests">
                                <button 
                                 onClick={toggleComponents}
                                 data-component="friend_requests"
                                 className="not-button">
                                    friend requests
                                </button>
                            </li>
                        </ul>
                    </nav>
                
                    {currentSidebarComponent === 'rooms' && <Rooms setShowCreateRoomModal={setShowCreateRoomModal} />}
                    {currentSidebarComponent === 'friends' && <Friends setShowAddUserToRoomModal={setShowAddUserToRoomModal} />}
                    {currentSidebarComponent === 'friend_requests' && <FriendRequests/>}

                </article>


                <div className="setting-container">
                    <button className="setting">
                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.9937 15.4465C22.0066 15.5711 21.9937 15.6983 21.9499 15.8203L21.9268 15.8892C21.4614 17.2245 20.7664 18.4626 19.8751 19.5444L19.8288 19.6001C19.7208 19.7315 19.5765 19.826 19.4151 19.871C19.2537 19.9159 19.0829 19.9093 18.9252 19.8519L16.8324 19.0859C16.0646 19.7372 15.1974 20.2531 14.2659 20.6126L13.8618 22.8657C13.8313 23.0352 13.7514 23.1911 13.6328 23.3128C13.5142 23.4345 13.3624 23.5161 13.1976 23.5469L13.1281 23.5601C12.4553 23.6853 11.773 23.7483 11.0894 23.7483H11.0971C11.7844 23.7483 12.4717 23.6847 13.141 23.5601L13.2105 23.5469C13.3753 23.5161 13.527 23.4345 13.6457 23.3128C13.7643 23.1911 13.8442 23.0352 13.8746 22.8657L14.2788 20.6153C15.2107 20.2548 16.0704 19.7432 16.8427 19.0912L18.933 19.8572C19.0906 19.9146 19.2615 19.9212 19.4228 19.8763C19.5842 19.8313 19.7285 19.7368 19.8365 19.6054L19.8828 19.5497C20.7787 18.4603 21.466 17.2331 21.9319 15.8998L21.9551 15.8309C21.9963 15.7063 22.0091 15.5738 21.9937 15.4465V15.4465Z" fill="black" fillOpacity="0.15"/>
                            <path d="M15.6148 11.6137C15.6148 10.8106 15.4166 10.0525 15.0691 9.39249C14.302 7.93729 12.8063 6.94861 11.0842 6.94861C8.58208 6.94861 6.5536 9.03731 6.5536 11.6137C6.5536 13.387 7.51378 14.927 8.92702 15.7169C9.568 16.0747 10.3016 16.2788 11.0842 16.2788C13.5863 16.2788 15.6148 14.1901 15.6148 11.6137ZM8.2011 11.6137C8.2011 10.8212 8.50228 10.0764 9.04543 9.51442C9.59117 8.95249 10.3145 8.64501 11.0842 8.64501C11.8539 8.64501 12.5772 8.95249 13.123 9.51442C13.3911 9.78976 13.6038 10.117 13.7487 10.4773C13.8936 10.8375 13.9679 11.2238 13.9673 11.6137C13.9673 12.4063 13.6661 13.1511 13.123 13.713C12.8556 13.9892 12.5378 14.2081 12.1879 14.3573C11.838 14.5065 11.4629 14.583 11.0842 14.5824C10.3145 14.5824 9.59117 14.2723 9.04543 13.713C8.77726 13.4377 8.56461 13.1105 8.4197 12.7502C8.2748 12.3899 8.20051 12.0037 8.2011 11.6137V11.6137Z" fill="white"/>
                            <path d="M13.1976 23.5469C13.3624 23.5162 13.5142 23.4345 13.6328 23.3128C13.7514 23.1912 13.8313 23.0352 13.8618 22.8657L14.2659 20.6126C15.1974 20.2531 16.0646 19.7372 16.8324 19.0859L18.9252 19.8519C19.0829 19.9093 19.2537 19.916 19.4151 19.871C19.5765 19.826 19.7208 19.7315 19.8288 19.6001L19.8751 19.5444C20.7709 18.455 21.4608 17.2251 21.9268 15.8892L21.9499 15.8203C21.9937 15.6984 22.0066 15.5711 21.9937 15.4466C21.9705 15.2372 21.8727 15.0384 21.7105 14.8926L20.0296 13.4109L20.0244 13.4082C20.1042 12.9046 20.1454 12.3904 20.1454 11.8762C20.1454 11.4282 20.1145 10.9776 20.0527 10.5376C20.045 10.4793 20.0347 10.421 20.027 10.3626C20.027 10.3573 20.0244 10.3494 20.0244 10.3441L21.7105 8.85974C21.8881 8.70335 21.9911 8.47805 21.9988 8.24479C22.0014 8.13877 21.986 8.03009 21.9499 7.92672L21.9268 7.8578C21.4626 6.52195 20.7675 5.2836 19.8751 4.20258L19.8288 4.14691C19.7205 4.01585 19.5762 3.92163 19.4149 3.87668C19.2536 3.83172 19.0829 3.83815 18.9252 3.8951L16.8324 4.66114C16.0601 4.00908 15.2004 3.49486 14.2685 3.13437H14.2659L13.8618 0.881335C13.8592 0.868082 13.8566 0.852178 13.8515 0.838925C13.8143 0.678667 13.7327 0.532978 13.6166 0.419572C13.5006 0.306165 13.355 0.229926 13.1976 0.200123L13.1281 0.18687C11.787 -0.0622899 10.3763 -0.0622899 9.03513 0.18687L8.96563 0.200123C8.80087 0.230861 8.64909 0.312491 8.53047 0.434168C8.41184 0.555844 8.33197 0.711807 8.30148 0.881335L7.89476 3.14498C6.97033 3.50554 6.10946 4.01949 5.34629 4.66644L3.23802 3.8951C3.08039 3.8377 2.90953 3.83104 2.74814 3.87602C2.58674 3.921 2.44247 4.01548 2.33447 4.14691L2.28814 4.20258C1.39681 5.28436 0.701851 6.52251 0.236496 7.8578L0.213329 7.92672C0.159685 8.08076 0.150338 8.24748 0.186409 8.40686C0.22248 8.56624 0.302437 8.71152 0.416691 8.82528C0.429562 8.83588 0.439859 8.84914 0.45273 8.85974L2.15943 10.36V10.3626C2.07963 10.861 2.04101 11.3672 2.04101 11.8735C2.04101 12.3824 2.07963 12.8914 2.15943 13.387L0.45273 14.8873C0.325553 14.9994 0.234531 15.1487 0.191767 15.3154C0.149003 15.482 0.156524 15.6581 0.213329 15.8203L0.236496 15.8892C0.702428 17.2251 1.39231 18.4577 2.28814 19.5444L2.33447 19.6001C2.46061 19.7512 2.62793 19.8493 2.8107 19.8837C2.94971 19.9102 3.09644 19.9023 3.23802 19.8519L5.34629 19.0806C5.34887 19.0832 5.35402 19.0859 5.35659 19.0885C6.12113 19.7326 6.97319 20.2442 7.89476 20.602L8.30148 22.8657C8.33197 23.0352 8.41184 23.1912 8.53047 23.3128C8.64909 23.4345 8.80087 23.5162 8.96563 23.5469L9.03513 23.5601C9.707 23.6847 10.3943 23.7483 11.0816 23.7483H11.0893C11.7741 23.7483 12.4614 23.6847 13.1281 23.5601L13.1976 23.5469V23.5469ZM12.1731 21.7842C11.4461 21.869 10.712 21.869 9.98501 21.7842L9.52423 19.2078L8.55118 18.8235C7.81753 18.5372 7.13537 18.129 6.52528 17.6121L5.71698 16.9256L3.31267 17.8056C2.87506 17.1986 2.50952 16.5439 2.21606 15.8548L4.15959 14.1451L3.99226 13.0848C3.93048 12.6899 3.89702 12.2817 3.89702 11.8788C3.89702 11.4733 3.92791 11.0677 3.99226 10.6728L4.15959 9.61252L2.21606 7.90286C2.50695 7.21105 2.87506 6.55899 3.31267 5.95199L5.71698 6.832L6.52528 6.14549C7.13537 5.62862 7.81753 5.22042 8.55118 4.93415L9.5268 4.55511L9.98759 1.9787C10.7109 1.89388 11.4497 1.89388 12.1757 1.9787L12.6364 4.54981L13.6172 4.92885C14.356 5.21512 15.0433 5.62332 15.6586 6.14284L16.4669 6.8267L18.8557 5.95465C19.2933 6.56164 19.6589 7.21635 19.9523 7.90551L18.0294 9.59926L18.1967 10.6569C18.2611 11.0571 18.2945 11.468 18.2945 11.8788C18.2945 12.2897 18.2611 12.7005 18.1967 13.1007L18.0268 14.1637L19.9498 15.8574C19.6583 16.5489 19.2903 17.2035 18.8532 17.8083L16.4643 16.9362L15.656 17.6201C15.0408 18.1396 14.356 18.5478 13.6146 18.8341L12.6339 19.2131L12.1731 21.7842V21.7842Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            </section>

            {currentRoom.room_id && socketState.submittedList.currentRoom
                ? <ChatRoom />
                : <div className="no-room"><span>Open room to start chatting</span></div>
            }


            {showCreateRoomModal &&
                <ModalWrapper
                 hideModalCallback={() => setShowCreateRoomModal(false)}
                 hideModalOnCoverClick={true}
                 transparentCover={true}
                 >

                    <CreateRoom/>
                </ModalWrapper>
            }

            {showAddUserToRoomModal.showModal &&
                <ModalWrapper
                 hideModalCallback={() => setShowAddUserToRoomModal({showModal: false, userId: ''})}
                 hideModalOnCoverClick={true}
                 transparentCover={true}
                 >

                    <AddUserToRoom userId={showAddUserToRoomModal.userId} />
                </ModalWrapper>
            }


            {socketState.invitation &&
                <ModalWrapper
                 hideModalCallback={() => clearInvitation()}
                 hideModalOnCoverClick={false}
                 autoHideModal={true}
                 autoHideModalDelay={25000}
                 showHideModalCountDown={true}
                 transparentCover={true}
                 >

                    <VideoCallInvitation />
                    
                </ModalWrapper>
            }

        </main>
    )
}


export default Home