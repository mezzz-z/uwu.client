import { useAuth } from "../../context/index";
import { Navigate } from "react-router-dom";
import routes from "../../router/routes.js";

const UnAuthRequired = ({ children }) => {
	const {
		auth: { isLoggedIn, isModalOpen },
	} = useAuth();

	return isLoggedIn && !isModalOpen ? (
		<Navigate to={routes.home.path} />
	) : (
		children
	);
};

export default UnAuthRequired;
