import {
    CONNECTION_CREATED, SUBMIT_USER_ID,
    SUBMIT_CURRENT_ROOM,
    SET_INVITATION, CLEAR_INVITATION } from './actions'


const socketReducer = (state, action) => {
    switch (action.type) {
        case SUBMIT_CURRENT_ROOM:
            return {
                ...state,
                submittedList: {
                    ...state.submittedList,
                    currentRoom: true
                }
            }

        case SUBMIT_USER_ID:
            return {
                ...state,
                submittedList: {
                    ...state.submittedList,
                    userId: true
                }
            }

        case CONNECTION_CREATED:
            return {
                ...state,
                socket: action.payload,
                isConnected: true
            }

        case SET_INVITATION:
            return {
                ...state,
                invitation: action.payload
            }

        case CLEAR_INVITATION:
            return {
                ...state,
                invitation: null
            }

        default: return state
    }
}

export default socketReducer