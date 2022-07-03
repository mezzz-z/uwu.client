import { useContext } from 'react'
import { authContext } from '../../context/index'
import { Navigate } from  'react-router-dom'

const UnAuthRequired = ({children}) => {

    const { auth: { isLoggedIn, isModalOpen } } = useContext(authContext)

    return (
        isLoggedIn && !isModalOpen
            ? <Navigate to="/home" />
            : children
    )
}

export default UnAuthRequired