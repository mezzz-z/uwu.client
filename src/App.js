import Router from './Router.js'
import { useEffect } from 'react'
import { useSocket, useAuth } from './context/index'


const App = () => {

  const { refreshToken, auth: { isRefreshing } } = useAuth()
  const { createConnection, socketState } = useSocket()

  useEffect(() => {
    refreshToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if(socketState.isConnected) return
    createConnection('http://localhost:8080/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
      isRefreshing || !socketState.isConnected
        ? <h3>Loading...</h3>
        : <Router />
  )
}


export default App