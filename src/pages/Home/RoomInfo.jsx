import { useState, useEffect } from 'react'
import { useAuth } from '../../context/index.js'
import roomsAPI from '../../api/rooms.js'
import noProfile from '../../assets/images/no-profile.png'
import { Link } from 'react-router-dom'

const mainContainerAnimationDuration = 400
const innerContainerAnimationDuration = 800

const mainContainerInitialState = {
    transform: 'translateX(-200%)',
    transition: `${mainContainerAnimationDuration}ms ease-in-out`
}
const innerContainerInitialState = {
    transform: 'translateX(150%)',
    transition: `${innerContainerAnimationDuration}ms ease-in-out`,
    opacity: 0,
}

const RoomInfo = ({ removeComponent, room }) => {
    const [mainContainerStyle, setMainContainerStyle] = useState(mainContainerInitialState)
    const [innerContainerStyle, setInnerContainerStyle] = useState(innerContainerInitialState)

    const { auth: { token } } = useAuth()

    const [roomMembers, setRoomMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const handleRemoveComponent = () => {
        const totalDuration = innerContainerAnimationDuration + mainContainerAnimationDuration + 500
        setInnerContainerStyle(innerContainerInitialState)
        setTimeout(() => setMainContainerStyle(mainContainerInitialState), innerContainerAnimationDuration)
        setTimeout(() => removeComponent(), totalDuration)
    }

    useEffect(() => {

        roomsAPI.getRoomMembers(room.room_id, token)
         .then(({data}) => {
            setRoomMembers(data.members)
         })
         .catch(err => {
            console.log(err)
         })
         .finally(() => {
            setIsLoading(false)
         })

        setMainContainerStyle(state => ({ ...state, transform: 'translateX(0%)'}))

        setTimeout(() => {
            setInnerContainerStyle(state => ({...state, transform: 'translateX(0%)', opacity: 1}))
        } , mainContainerAnimationDuration / 2)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section
         id="room-info"
         style={mainContainerStyle}
         >

            <div onClick={handleRemoveComponent} className="close-button">
                <div className="close-button-icon">
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div
             className="inner-container"
             style={innerContainerStyle}
             >

                <article className="header">
                    <h3 className="room-name">{room.room_name}</h3>
                </article>
                <article className="content-wrapper">
                    <div className="basic-information">
                        <div className="item members-count">
                            <span className="key">members : </span>
                            <span className="value">{room.users_ids.length}</span>
                        </div>
                        <div className="item room-id">
                            <span className="key">Id : </span>
                            <span className="value">{room.room_id}</span>
                        </div>
                        <div className="item room-id">
                            <span className="key">Created at : </span>
                            <span className="value">{(room.created_at).split("T")[0]}</span>
                        </div>
                    </div>

                    <div className={`users ${isLoading && 'loading'}`}>
                        {!isLoading
                            ? roomMembers.map(user => {
                                return (
                                    <article key={user.user_id} className="user">
                                        <img src={user.profile_picture || noProfile} alt="" className="profile-picture" />
                                        <span className="username">{user.username}</span>
                                        <div className="actions">
                                            <Link className="see-profile" to={`/user-profile/${user.user_id}`}>see profile</Link>
                                        </div>
                                    </article>
                                )})
                            : <h4>Loading...</h4>}
                    </div>

                </article>
                
            </div>
        </section>
    ) 
}

export default RoomInfo