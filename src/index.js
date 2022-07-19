import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { AuthState, SocketState, UserState } from "./context/index.js";
import "./assets/css/main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<StrictMode>
		<AuthState>
			<SocketState>
				<UserState>
					<App />
				</UserState>
			</SocketState>
		</AuthState>
	</StrictMode>
);
