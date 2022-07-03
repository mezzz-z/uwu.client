import noProfileSrc from '../../assets/images/no-profile.png';
import { useNavigate } from 'react-router-dom'
import friendsAPI from '../../api/friends.js'
import { useEffect, useContext } from 'react'
import { userContext, authContext, socketContext } from '../../context/index.js'
import { v4 as uuidv4 } from 'uuid'

const Friends = () => {

    const { setVideoCallTicket, setFriends, userState: {friends, isFriendsLoading: isLoading} } = useContext(userContext)
    const { auth } = useContext(authContext)
    const { socketState: {socket} } = useContext(socketContext)
    
    const navigate = useNavigate()

    const handleVideoCallInvitation = (friendId, friendStatus) => {
        // TODO: add modal later
        if(friendStatus === 'offline') return
        const videoCallRoomId = uuidv4()
        // you cant join the call without ticket
        socket.emit('video-call/send-invite', {
            userId: friendId,
            invitationCode: videoCallRoomId
        })

        
        socket.on('video-call/invitation-result', data => {
            if(data.success) return navigate(`/video-call/${videoCallRoomId}`)
            console.log('user is busy')
        })
    }

    useEffect(() => {

        if(friends.length <= 0 && isLoading) {
            friendsAPI.getUserFriends(auth.token)
             .then(({data}) => {
                setFriends(data.userFriends)
             })
             .catch(err => {
                console.log(err)
             })
        } else {
            socket.on('global/friend-status-changed', ({userId, status}) => {
                setFriends(friends.map(friend => {
                    if(friend.user_id === userId){
                        return {...friend, status: status}
                    }
                    return friend
                }))
            })
        }

        return () => {
            socket.removeListener('global/friend-status-changed')
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friends])

    return (
        <section className="friends-container">
            <div className="header">
                <h3 className="title">Friends List</h3>
                <div className="friends-count-container">
                    <span>friends:</span>
                    <span className="count">{
                        isLoading
                            ? 'Loading...'
                            : friends.length
                    }</span>
                </div>
            </div>


            <div className="friends">
                {isLoading 
                    ?   <h3>Loading...</h3> 
                    :   friends.length <= 0
                            ? <h3>You have no friends</h3>
                            : friends.map(friend => {
                                return (
                                    <div key={friend.user_id} className="friend">                   
                                        <img
                                        src={friend.profile_picture ? friend.profile_picture : noProfileSrc} 
                                        alt=""
                                        className="profile-picture" />

                                        <section className="profile-details">
                                            <h4 className="name">{friend.username}</h4>
                                            <div className="status-container">
                                                <span>status:</span>
                                                <span className={`status status-${friend.status}`}>{friend.status}</span>
                                            </div>
                                        </section>
                                        <section className="actions-container">
                                            <button href="" className="add-to-room action not-button">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 0H2C0.897 0 0 0.897 0 2V20L4 16H18C19.103 16 20 15.103 20 14V2C20 0.897 19.103 0 18 0ZM15 9H11V13H9V9H5V7H9V3H11V7H15V9Z" fill="#0D66EC"/>
                                                </svg>
                                            </button>
                                            <button
                                            className="video-call action not-button"
                                            onClick={() => handleVideoCallInvitation(friend.user_id, friend.status)} >
                                                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 2C16 0.897 15.103 0 14 0H2C0.897 0 0 0.897 0 2V12C0 13.103 0.897 14 2 14H14C15.103 14 16 13.103 16 12V8.667L20 12V2L16 5.333V2Z" fill="#BA62FF"/>
                                                </svg>
                                            </button>
                                            <div className="more action">
                                                <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.54764e-05 12.4116V12.0286C0.00952416 11.9976 0.025372 11.9694 0.0317111 11.9385C0.171172 11.133 0.925527 10.4965 1.80982 10.443C2.79872 10.381 3.63548 10.8823 3.90807 11.6991C3.94293 11.8061 3.96829 11.9187 3.99998 12.0286V12.4116C3.99048 12.4369 3.97463 12.4595 3.97146 12.4876C3.83517 13.2311 3.23295 13.7972 2.40887 13.9578C2.34547 13.969 2.28208 13.9859 2.21869 14H1.78763C1.75911 13.9916 1.73058 13.9775 1.70205 13.9747C0.877968 13.8564 0.250411 13.3353 0.0602214 12.6115C0.0412041 12.5411 0.0190174 12.4764 0 12.4116H1.54764e-05ZM4 1.58559L3.99998 1.96864C3.99048 1.99962 3.97463 2.02778 3.97146 2.05876C3.82883 2.86987 3.0713 3.50355 2.17749 3.55424C1.19175 3.61057 0.35816 3.10363 0.0887473 2.28407C0.0538821 2.17985 0.028526 2.07284 0 1.96863V1.5856C0.00950868 1.56026 0.0253565 1.53772 0.0316956 1.51238C0.183834 0.780128 0.662438 0.301349 1.46117 0.073225C1.56576 0.0422452 1.6767 0.0253471 1.78446 0H2.21552C2.24405 0.00844904 2.27257 0.0225308 2.3011 0.0253471C3.12836 0.14645 3.75276 0.664658 3.94293 1.38846C3.96197 1.45605 3.98098 1.52083 4 1.58559ZM3.99998 6.80711V7.19013C3.99048 7.22111 3.97463 7.24927 3.96829 7.28025C3.82566 8.08855 3.03961 8.73912 2.15213 8.77292C1.15372 8.81235 0.307447 8.27724 0.0697302 7.45205C0.0443737 7.36474 0.0221869 7.27744 0 7.19013V6.80711C0.00950868 6.77613 0.0253565 6.74797 0.0316956 6.71699C0.171156 5.90869 0.960376 5.2581 1.84785 5.22151C2.84626 5.17926 3.69254 5.71718 3.93025 6.54237C3.95561 6.63249 3.9778 6.7198 3.99998 6.80711Z" fill="black"/>
                                                </svg>
                                            </div>
                                        </section>
                                    </div>
                                )
                            })

                }
            </div>
        </section>
    )
}

export default Friends