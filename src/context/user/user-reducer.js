import { 
    SET_USER, SET_USER_FRIENDS,
    SET_USER_FRIEND_REQUESTS,
    SET_VIDEO_CALL_TICKET, REMOVE_VIDEO_CALL_TICKET } from './user-actions'



const userReducer = (state, action) => {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                profilePicture: action.payload.profilePicture,
                userId: action.payload.userId
            }

        case SET_USER_FRIENDS:
            return {
                ...state,
                friends: action.payload,
                isFriendsLoading: false
            }
        
        case SET_USER_FRIEND_REQUESTS:
            return {
                ...state,
                friendRequests: action.payload.friendRequests
            }

        default:
            return{}
    }
}

export default userReducer