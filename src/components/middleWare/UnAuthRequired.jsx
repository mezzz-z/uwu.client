import { useAuth } from '../../context/index'
import { Navigate } from  'react-router-dom'

const UnAuthRequired = ({children}) => {

    const { auth: { isLoggedIn, isModalOpen } } = useAuth()

    return (
        isLoggedIn && !isModalOpen
            ? <Navigate to="/home" />
            : children
    )
}

export default UnAuthRequired