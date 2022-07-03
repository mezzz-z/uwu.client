import { useEffect, useContext, useState } from 'react'
import { socketContext, userContext } from '../../context/index.js'
import { useNavigate } from 'react-router-dom'
import noProfile from '../../assets/images/no-profile.png'

const Invitation = () => {

    const { socketState: { invitation, socket }, clearInvitation } = useContext(socketContext)
    const { setVideoCallTicket, userState: { friends } } = useContext(userContext)

    
    const [ inviteSender, setInviteSender ] = useState({})

    const navigate = useNavigate()
    

    const handleInvitationResult = (accepted) => {
        
        if(!accepted) {
            socket.emit('video-call/reject-invite', invitation.senderId)
        } else {
            navigate(`/video-call/${invitation.invitationCode}`)
        }

        clearInvitation()
    }

    useEffect(() => {
        const friend = friends.find(friend => friend.user_id === invitation.senderId)
        setInviteSender(friend)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="invitation-modal-container">
            {inviteSender &&
                <>
                
                <div className="question-box">
                    <h3>Let's see each other</h3>
                    <div className="submit-buttons-wrapper">
                        <button className="accept" onClick={() => handleInvitationResult(true)} >Accept</button>
                        <button className="reject" onClick={() => handleInvitationResult(false)} >Reject</button>
                    </div>
                </div>
                <div className="invite-sender">
                    <img src={inviteSender.profile_picture || noProfile} alt="" className="profile-picture" />
                    <span className="username">{inviteSender.username}</span>
                </div>
                </>
            }
        </section>
    )
}


export default Invitation