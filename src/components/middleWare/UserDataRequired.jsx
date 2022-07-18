import { useUser, useAuth } from "../../context/index.js";
import { useEffect } from "react";
import usersAPI from "../../api/users.js";

const UserDataRequired = ({ children }) => {
	const {
		auth: { token },
	} = useAuth();

	const {
		userState: { initialized },
		setUser,
	} = useUser();

	const fetchUser = async () => {
		try {
			const { data } = await usersAPI.getCurrentUser(token);
			setUser(data.user.username, data.user.email, data.user.profile_picture);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (initialized) return;
		fetchUser();
	});

	return initialized ? children : <h3>Loading...</h3>;
};

export default UserDataRequired;
