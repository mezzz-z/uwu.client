import Router from './Router.js'
import { useEffect, useContext } from 'react'
import { authContext } from './context/index'
import { socketContext } from './context/index'


const App = () => {

  const { refreshToken, auth: {isRefreshing} } = useContext(authContext)
  const { createConnection, socketState, configEventListeners } = useContext(socketContext)

  useEffect(() => {
    refreshToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(!socketState.isConnected){
      createConnection('http://localhost:8080/')
    } else {
      configEventListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketState.isConnected])


  return (
      isRefreshing || !socketState.isConnected || !socketState.configured
        ? <h3>Loading...</h3>
        : <Router />
  )
}


export default App