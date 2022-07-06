import { useEffect, useContext, useState } from 'react'
import { authContext, userContext, socketContext } from '../../context/index.js'
import usersAPI from '../../api/users.js'
import noProfile from '../../assets/images/no-profile.png'

const FriendRequests = () => {

    const { auth } = useContext(authContext)
    const { socketState: {socket} } = useContext(socketContext)
    const { userState: { friendRequests }, setFriendRequests, newFriendRequest } = useContext(userContext)

    const [isLoading, setIsLoading] = useState(true)


    const sendRequestAnswer = (accepted, targetId) => {
        socket.emit('friends/send-friend-request-response', {accepted: accepted, reqReceiverId: targetId})
    }

    useEffect(() => {
        usersAPI.getUserFriends(auth.token)
        .then(({data}) => {
            setFriendRequests(data.friendRequests)
            setIsLoading(false)

            socket.on('friends/incoming-friend-request', ({ sender }) => {
                newFriendRequest(sender)
             })
         }).catch(err => console.log(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    return (
        <section className="friend-requests-container">
            {isLoading
                ? <h3>Loading...</h3>
                : friendRequests.length === 0
                    ? <h3>You have no friends</h3>
                    : friendRequests.map(user => {
                        return (
                            <div key={user.user_id} className="friend-request">
                                <img src={user.profile_picture || noProfile} alt="" className="profile-picture" />
                                <span className="username">{user.username}</span>
                                <div className="actions">
                                <button onClick={() => sendRequestAnswer(true, user.user_id)} className="accept">accept</button>
                                <button onClick={() => sendRequestAnswer(false, user.user_id)} className="reject">reject</button>
                                </div>
                            </div>
                        )
                    })
            }
        </section>
    )
}

export default FriendRequests