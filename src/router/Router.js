import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {
	Login,
	Signup,
	Home,
	VideoCallRoom,
	Profile,
	NotFound,
} from "../pages/index.js";

import routes from "./routes";

import {
	UserDataRequired,
	AuthRequired,
	UnAuthRequired,
} from "../components/middleWare/index.js";

import { CurrentRoomState } from "../context/index";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path={routes.signup.path}
					element={
						<UnAuthRequired>
							<Signup />
						</UnAuthRequired>
					}
				/>
				<Route
					path={routes.login.path}
					element={
						<UnAuthRequired>
							<Login />
						</UnAuthRequired>
					}
				/>

				<Route
					path={routes.home.path}
					element={
						<AuthRequired>
							<UserDataRequired>
								<CurrentRoomState>
									<Home />
								</CurrentRoomState>
							</UserDataRequired>
						</AuthRequired>
					}
				/>

				<Route path='/' element={<Navigate to={routes.login.path} />} />

				<Route
					path={`${routes.videoCall.path}/:roomId`}
					element={
						<AuthRequired>
							<VideoCallRoom />
						</AuthRequired>
					}
				/>

				<Route
					path={routes.profile.path}
					element={
						<AuthRequired>
							<UserDataRequired>
								<Profile />
							</UserDataRequired>
						</AuthRequired>
					}
				/>

				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
