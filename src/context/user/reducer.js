import {
	SET_USER,
	SET_FRIENDS,
	SET_FRIEND_REQUESTS,
	ADD_NEW_FRIEND_REQUEST,
	REMOVE_FRIEND_REQUEST,
	ADD_NEW_FRIEND,
	REMOVE_FRIEND,
	SET_AWAIT_FRIENDS,
	UPDATE_FRIEND_STATUS,
} from "./actions";

const userReducer = (state, action) => {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				username: action.payload.username,
				email: action.payload.email,
				profile_picture: action.payload.profile_picture,
				userId: action.payload.userId,
				initialized: true,
			};

		case SET_FRIENDS:
			return {
				...state,
				friends: action.payload,
				isFriendsLoading: false,
			};

		case SET_FRIEND_REQUESTS:
			return {
				...state,
				friendRequests: action.payload,
			};

		case ADD_NEW_FRIEND_REQUEST:
			return {
				...state,
				friendRequests: [...state.friendRequests, action.payload],
			};

		case REMOVE_FRIEND_REQUEST:
			return {
				...state,
				friendRequests: state.friendRequests.filter(
					fr => fr.user_id !== action.payload
				),
			};

		case ADD_NEW_FRIEND:
			return {
				...state,
				friends: [...state.friends, action.payload],
			};

		case REMOVE_FRIEND:
			return {
				...state,
				friends: state.friends.filter(
					friend => friend.user_id !== action.payload
				),
			};

		case SET_AWAIT_FRIENDS:
			return {
				...state,
				awaitFriends: action.payload,
			};

		case UPDATE_FRIEND_STATUS:
			return {
				...state,
				friends: state.friends.map(friend => {
					if (!friend.user_id === action.payload.userId) return friend;

					friend.status = action.payload.status;
					return friend;
				}),
			};

		default:
			return {};
	}
};

export default userReducer;
