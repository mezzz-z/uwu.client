import UserContext from './user-context.js'
import userReducer from './user-reducer.js'
import { useReducer } from 'react'
import { SET_USER, SET_USER_FRIENDS, SET_USER_FRIEND_REQUESTS,NEW_USER_FRIEND_REQUEST } from './user-actions'

const UserState = (props) => {

    const [state, dispatch] = useReducer(userReducer, {
        username: '',
        email: '',
        profilePicture: '',
        friends: [],
        friendRequests: [],
        videoCallTicket: null,
    })
    

    const setFriends = (friends) => {
        dispatch({type: SET_USER_FRIENDS, payload: friends})
    }

    const setFriendRequests = (friendRequests) => {
        dispatch({type: SET_USER_FRIEND_REQUESTS, payload: friendRequests})
    }

    const newFriendRequest = (friendRequests) => {
        dispatch({type: NEW_USER_FRIEND_REQUEST, payload: friendRequests})
    }

    const setUser = (username, email, profilePicture) => {
        dispatch({type: SET_USER, payload: {
            username,
            email,
            profilePicture
        }})
    }

    return (
        <UserContext.Provider value={{
            userState: state,
            setFriends,
            setUser,
            setFriendRequests,
            newFriendRequest
        }}>

            {props.children}

        </UserContext.Provider>
    )
}

export default UserState