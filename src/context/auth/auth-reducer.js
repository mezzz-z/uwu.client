import { IS_REFRESHING, IS_MODAL_OPEN, LOGGED_IN, LOGGED_OUT } from './auth-actions'



const authReducer = (state, action) => {
    switch(action.type) {
        case LOGGED_IN:
            return {
                ...state,
                isLoggedIn: true,
                token: action.payload.token,
                isRefreshing: false,
                userId: action.payload.userId
            }

        case LOGGED_OUT:
            return {
                ...state,
                isLoggedIn: false,
                username: '',
                token: '',
                isRefreshing: false
            }

        case IS_REFRESHING:
            return {
                ...state,
                isRefreshing: action.payload
            }

        case IS_MODAL_OPEN:
            return {
                ...state,
                isModalOpen: action.payload
            }

        default:
            return{}
    }
}

export default authReducer