import { useEffect, useContext, useState } from 'react'
import { authContext, userContext, socketContext } from '../../context/index.js'
import usersAPI from '../../api/users.js'
import noProfile from '../../assets/images/no-profile.png'

const FriendRequests = () => {

    const { auth } = useContext(authContext)
    const { socketState: {socket} } = useContext(socketContext)
    const { 
        userState: { friendRequests, awaitFriends },
        setFriendRequests,
        addNewFriendRequest,
        addNewFriend,
        removeFriendRequest} = useContext(userContext)

    const [isLoading, setIsLoading] = useState(true)


    const sendRequestAnswer = (accepted, targetId) => {
        socket.emit('friends/send-friend-request-answer', {
            accepted: accepted,
            answerReceiverId: targetId,
            accessToken: auth.token
        })
    }

    useEffect(() => {
        usersAPI.getUserFriends(auth.token)
        .then(({data}) => {
            setFriendRequests(data.friendRequests)
            setIsLoading(false)

            socket.on('friends/incoming-friend-request', ({ sender }) => {
                addNewFriendRequest(sender)
            })
            socket.on('friends/friend-request-answer-sent', (payload) => {
                if(!payload.success) return console.log(payload.message)
                removeFriendRequest(payload.answerReceiver.user_id)

                if(!payload.accepted) return
                // if current user's friends is already fetched &&
                // add answerReceiver data as a new friend
                if(awaitFriends) return
                addNewFriend(payload.answerReceiver)
            })


         }).catch(err => console.log(err))
            return () => {
                socket.removeListener('friends/incoming-friend-request')
                socket.removeListener('friends/friend-request-answer-sent')
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <section className="friend-requests-container">
            {isLoading
                ? <span>Loading...</span>
                : friendRequests.length === 0
                    ? <h5 className="no-friend-requests">You have no Friend requests</h5>
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