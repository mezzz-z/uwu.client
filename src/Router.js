import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom'
import { Login, Signup, Home, VideoCallRoom, Notfound, NotFound } from './pages/index.js'
import AuthRequired from './components/middleWare/AuthRequired.jsx'
import UnAuthRequired from './components/middleWare/UnAuthRequired'
import { UserState, CurrentRoomState } from './context/index'



const Router = () => {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<UnAuthRequired><Signup /></UnAuthRequired>} />
                <Route path="/login" element={<UnAuthRequired><Login /></UnAuthRequired>} />


                <Route path="/home" element={
                    <AuthRequired>
                        <UserState>
                            <CurrentRoomState>
                                <Home />
                            </CurrentRoomState>
                        </UserState>
                    </AuthRequired>} />

                <Route path="/" element={<Navigate to={'/login'} />} />

                <Route path="/video-call/:roomId" element={
                    <AuthRequired>
                        <UserState>
                            <VideoCallRoom />
                        </UserState>
                    </AuthRequired>} />

                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    )
}


export default Router