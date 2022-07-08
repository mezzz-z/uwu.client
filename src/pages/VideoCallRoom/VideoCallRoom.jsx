import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../context/index.js'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ModalWrapper from '../../components/ModalWrapper/ModalWrapper.jsx'

import MuteMicIcon from './icons/MuteMicIcon.jsx'
import EndCallIcon from './icons/EndCallIcon.jsx'
import MuteCameraIcon from './icons/MuteCameraIcon.jsx'

const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302'
            ]
        }
    ]
}
let constraints = {
    video:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080},
    },
    audio: false
}


const VideoCallRoom = () => {
    
    const {roomId}  = useParams()
    // const navigate = useNavigate()
    
    const {socketState: {socket}} = useSocket()
    
    // references
    const pc = useRef(new RTCPeerConnection(servers))
    const currentUserVideoElem = useRef(null)
    const peerVideoElem = useRef(null)
    const localStream = useRef(null)
    const remoteStream = useRef(null)
    const peerLoading = useRef(true)
    
    // hooks
    const navigate = useNavigate()
    
    // states
    const [peerJoined, setPeerJoined] = useState(false)
    const [modal, setModal] = useState({show: false, content: ''})
    const [validated, setValidated] = useState(false)

    const createAndSendOffer = async () => {
        const offer = await pc.current.createOffer({
            iceRestart: true,
            offerToReceiveAudio: false,
            offerToReceiveVideo: true
         })
        await pc.current.setLocalDescription(offer)
        // send the offer through the signal
        socket.emit('video-call/signal', {type: 'offer', offer, roomId})
        
        peerLoading.current = false
        setPeerJoined(true)
        // when you got the offer that means peer has already joined
    }


    const createAndSendAnswer = async (offer) => {
        // receive the offer from signal
        // create a SDP answer
        await pc.current.setRemoteDescription(offer)
        // send the answer through the signal
        const answerDesc = await pc.current.createAnswer()
        await pc.current.setLocalDescription(answerDesc)
        socket.emit('video-call/signal', {type: 'answer', answer: answerDesc, roomId})


        // when you got the answer that means peer has already joined
        peerLoading.current = false
        setPeerJoined(true)
    }

    const handleIncomingAnswer = async (answer) => {
        if(pc.current.currentRemoteDescription) return
        // getting SDP answer and set the SDP as currentRemoteDescription
        await pc.current.setRemoteDescription(answer)
        // bridge between the peers will be working from know
        // you can receive the floating data/streamTracks from the peer
    }

    const pcInitialSetup = async () => {
        // ask user for permission to access the mediaDevices
        localStream.current = await navigator.mediaDevices.getUserMedia(constraints)
        remoteStream.current = new MediaStream()
        // push audio && video to peer
        localStream.current.getTracks().forEach(track => {
            pc.current.addTrack(track, localStream.current)
        })
        // listen for incoming audio and video
        pc.current.ontrack = (e) => {
            e.streams[0].getTracks().forEach(track => {
                remoteStream.current.addTrack(track)
            })
        }
        // send iceCandidates through the signal
        pc.current.onicecandidate = (ev) => {
            if(!ev.candidate) return
            socket.emit('video-call/signal', {roomId, type: 'candidate', candidate: ev.candidate})
        }
        // video elements setup
        currentUserVideoElem.current.srcObject = localStream.current    
        peerVideoElem.current.srcObject = remoteStream.current

        socket.emit('video-call/join-room', roomId)
    }

    const toggleMic = (e) => {
        const audioTrack = localStream.current.getTracks().find(track => track.kind === 'audio')
        if(audioTrack) audioTrack.enabled = !audioTrack.enabled
        e.target.classList.toggle('de-active')
    }
    const toggleVideo = (e) => {
        const videoTrack = localStream.current.getTracks().find(track => track.kind === 'video')
        videoTrack.enabled = !videoTrack.enabled
        e.target.classList.toggle('de-active')
    }


    const handleIncomingSignals = (data) => {
        switch(data.type) {
            case 'offer':
                createAndSendAnswer(data.offer)
                break

            case 'answer':
                handleIncomingAnswer(data.answer)
                break

            case 'candidate':
                pc.current.addIceCandidate(data.candidate)
                break

            default: break
        }
    }

    
    const leaveVideoCall = () => {
        socket.emit('video-call/leave-room', roomId)
        localStream.current.getTracks().forEach(track => {
            track.stop()
        })
    }
    
    const handleLeaveButton = () => {
        leaveVideoCall()
        setModal({show: true, content: 'Leaving...'})
    }
    
    useEffect(() => {
        socket.on('video-call/access-denied', (message) => {
            setModal({show: true, content: message})
            leaveVideoCall()
        })

        socket.on('video-call/validated', () => {
            setValidated(true)
        })

        pcInitialSetup().then(() => { 
            socket.on('video-call/signal', handleIncomingSignals)
            socket.on('video-call/peer-joined', createAndSendOffer)
            socket.on('video-call/invite-rejected', () => {
                setModal({show: true, content: 'Your invite has been rejected'})
                leaveVideoCall()
            })
        })
        // if the invited user wont come
        // you will redirect to the home page
        setTimeout(() => {
            if(!peerLoading.current) return
            setModal({
                show: true, 
                content: 'Your friend seems busy, try again later'
            })
        }, 30000)


        return () => {
            leaveVideoCall()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <article id="video-call" className={
                !validated
                 ? 'validating'
                 : !peerJoined 
                        ? 'loading'
                        : undefined
            } >
                        <video
                            ref={currentUserVideoElem}
                            className="video-player current-user-video-input"
                            autoPlay={true}
                            playsInline></video>

                        <video
                            ref={peerVideoElem}
                            className="video-player peer-video-input"
                            autoPlay={true}
                            playsInline></video>

                        <div className="action-bar">
                            <button onClick={toggleMic} disabled={!peerJoined && true} className="action not-button">
                                <MuteMicIcon />
                            </button>
                            <button onClick={toggleVideo} disabled={!peerJoined && true} className="action not-button">
                                <MuteCameraIcon />
                            </button>
                            <button onClick={handleLeaveButton} className="action not-button">
                                <EndCallIcon />
                            </button>
                        </div>
                </article>

        { modal.show &&
            <ModalWrapper
                autoHideModal={true}
                autoHideModalDelay={4000}
                hideModalOnCoverClick={false}
                freeze={true} // modal will hide, but its animation will not apply to it
                hideModalCallback={() => {
                    navigate('/home')
                    setModal({show: false, content: ''})
                }}
                transparentCover={false}
            >
                <div className='modal'>
                    <h3>{modal.content}</h3>
                    <span>we will redirect you to the home page...</span>
                </div>
            </ModalWrapper>}
        </>
    )
}
export default VideoCallRoom