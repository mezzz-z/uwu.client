import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {
	Login,
	Signup,
	Home,
	VideoCallRoom,
	Profile,
	NotFound,
} from "./pages/index.js";

import {
	UserDataRequired,
	AuthRequired,
	UnAuthRequired,
} from "./components/middleWare/index.js";

import { CurrentRoomState } from "./context/index";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/signup'
					element={
						<UnAuthRequired>
							<Signup />
						</UnAuthRequired>
					}
				/>
				<Route
					path='/login'
					element={
						<UnAuthRequired>
							<Login />
						</UnAuthRequired>
					}
				/>

				<Route
					path='/home'
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

				<Route path='/' element={<Navigate to={"/login"} />} />

				<Route
					path='/video-call/:roomId'
					element={
						<AuthRequired>
							<VideoCallRoom />
						</AuthRequired>
					}
				/>

				<Route
					path='/my-profile'
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
