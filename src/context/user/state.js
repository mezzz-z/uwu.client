import UserContext from "./context.js";
import userReducer from "./reducer.js";
import { useReducer } from "react";
import {
	SET_USER,
	SET_FRIENDS,
	SET_FRIEND_REQUESTS,
	ADD_NEW_FRIEND_REQUEST,
	REMOVE_FRIEND_REQUEST,
	REMOVE_FRIEND,
	ADD_NEW_FRIEND,
	SET_AWAIT_FRIENDS,
	UPDATE_FRIEND_STATUS,
} from "./actions";

const UserState = props => {
	const [state, dispatch] = useReducer(userReducer, {
		username: "",
		email: "",
		profile_picture: "",
		friends: [],
		friendRequests: [],
		videoCallTicket: null,
		awaitFriends: true,
		initialized: false,
	});

	const setFriends = friends => {
		dispatch({ type: SET_FRIENDS, payload: friends });
	};

	const setFriendRequests = friendRequests => {
		dispatch({ type: SET_FRIEND_REQUESTS, payload: friendRequests });
	};

	const addNewFriendRequest = friendRequests => {
		dispatch({ type: ADD_NEW_FRIEND_REQUEST, payload: friendRequests });
	};

	const removeFriendRequest = userId => {
		dispatch({ type: REMOVE_FRIEND_REQUEST, payload: userId });
	};

	const addNewFriend = user => {
		dispatch({ type: ADD_NEW_FRIEND, payload: user });
	};

	const setAwaitFriends = bool => {
		dispatch({ type: SET_AWAIT_FRIENDS, payload: bool });
	};

	const removeFriend = userId => {
		dispatch({ type: REMOVE_FRIEND, payload: userId });
	};

	const setUser = (username, email, profilePicture) => {
		dispatch({
			type: SET_USER,
			payload: {
				username,
				email,
				profile_picture: profilePicture,
			},
		});
	};

	const updateFriendStatus = (userId, status) => {
		dispatch({ type: UPDATE_FRIEND_STATUS, payload: { userId, status } });
	};

	return (
		<UserContext.Provider
			value={{
				userState: state,
				setFriends,
				setUser,
				setFriendRequests,
				addNewFriendRequest,
				removeFriendRequest,
				addNewFriend,
				setAwaitFriends,
				updateFriendStatus,
				removeFriend,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserState;
