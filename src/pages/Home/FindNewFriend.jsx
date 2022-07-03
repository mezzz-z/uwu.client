import { useEffect, useState, useContext } from "react"
import usersAPI from '../../api/users'
import friendsAPI from '../../api/friends.js'
import noProfile from '../../assets/images/no-profile.png'
import {authContext} from '../../context/index.js'

const FindFriend = (userId) => {

    const [targetUser, setTargetUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const {auth: {token}} = useContext(authContext)

    useEffect(() => {
        usersAPI.getUser(userId)
         .then(({data}) => {
             setTargetUser(data.user)
         })
         .catch(err => console.log(err))
         .finally(() => {setLoading(false)})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendFriendRequest = async () => {
        if(!targetUser.user_id) return
        try {
            const {data} = await friendsAPI.sendFriendRequest(targetUser.user_id, token)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    
    
    return (

        <section className="find-new-friend">
            {loading
                ? <h3>Loading...</h3>
                : targetUser
                    ? <div className="user">
                        <img
                         alt="profile"
                         className="profile-picture"
                         src={targetUser.profile_picture || noProfile}>
                        </img>

                        <h3 className="username">{targetUser.username}</h3>

                        <button onClick={sendFriendRequest}>send friend request</button>
                         
                      </div>

                    : <h3>User not found</h3>
            }
        </section>

    )
}

export default FindFriend