import { useContext } from "react";
import UserContext from './user-context'

export default function useUser() {
	return useContext(UserContext)
}
