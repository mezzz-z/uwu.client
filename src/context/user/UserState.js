import UserContext from './user-context.js'
import userReducer from './user-reducer.js'
import { useReducer } from 'react'
import {SET_USER, SET_USER_FRIENDS} from './user-actions'

const UserState = (props) => {

    const [state, dispatch] = useReducer(userReducer, {
        username: '',
        email: '',
        profilePicture: '',
        friends: [],
        friendRequests: [],
        isFriendsLoading: true,
        videoCallTicket: null,
    })
    

    const setFriends = (friends) => {
        dispatch({type: SET_USER_FRIENDS, payload: friends})
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
            setUser
        }}>

            {props.children}

        </UserContext.Provider>
    )
}

export default UserState