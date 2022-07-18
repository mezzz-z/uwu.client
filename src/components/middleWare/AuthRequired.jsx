import { useEffect } from "react";
import { useAuth, useSocket } from "../../context/index";
import { Navigate } from "react-router-dom";

const AuthRequired = ({ children }) => {
	const {
		auth: { isLoggedIn, userId },
	} = useAuth();
	const { socketState, submitUserId } = useSocket();

	useEffect(() => {
		// submit user if he's not submitted
		if (isLoggedIn && !socketState.submittedList.userId) {
			socketState.socket.emit("global/submit-user-id", userId);

			socketState.socket.on("global/user-id-submitted", () => {
				submitUserId();
				console.log(`user submitted, id(${userId})`);
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isLoggedIn ? (
		socketState.submittedList.userId ? (
			children
		) : (
			<h3>Loading...</h3>
		)
	) : (
		<Navigate to='/login' />
	);
};

export default AuthRequired;
