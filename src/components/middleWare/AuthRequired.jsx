import { authContext, socketContext } from '../../context/index'
import { Navigate } from  'react-router-dom'
import { useContext, useEffect } from 'react'



const AuthRequired = ({children}) => {

    const { auth: { isLoggedIn, userId } } = useContext(authContext)
    const { socketState, submitUserId } = useContext(socketContext)

    useEffect(() => {
        if(isLoggedIn && !socketState.submittedList.userId) {
            submitUserId(userId)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        isLoggedIn
            ? socketState.submittedList.userId
                ? children
                : <h3>Loading...</h3>
            : <Navigate to="/login" />
    )
}

export default AuthRequired