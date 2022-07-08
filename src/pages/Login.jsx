import { useState } from 'react'
import { useAuth } from '../context/index'
import HandleInputs from '../helpers/HandleInputs'
import authAPI from '../api/auth.js'
import useFormModal from '../hooks/useFormModal'
import Modal from '../components/FormModal.jsx'
import { Link } from 'react-router-dom'

const Login = () => {

    const { loggedIn, setIsModalOpen } = useAuth()
    const [ formFields, setFormField ] = useState({username: '', password: ''})
    const { handle } = new HandleInputs(setFormField, formFields)
    const { modalState, setModal, removeModal } = useFormModal()

    const handleSubmit = async (e) => {

        e.preventDefault()
        if(!formFields.username || !formFields.password) setModal('Fields cannot be empty', false)

        try {
            const { data: { userId, accessToken, message } } = await authAPI.login(formFields.username, formFields.password)

            setModal(message, true)
            setIsModalOpen(true)
            loggedIn(accessToken, userId)

        } catch (err) {
            const errMessage = err.response?.data.message || 'Something went wrong'
            setModal(errMessage, false)
        }
    }

    return (
        <section id="login-signup">
            <article className="form-container">

                
                {modalState.openModal && <Modal
                        modalContent={modalState.content}
                        removeModal={removeModal}
                        modalClassName={modalState.modalClassName}
                />}


                <form onSubmit={handleSubmit}>
                    <div className="form-item form-item-title">
                        <h3 className="title">Login</h3>
                    </div>
                    <div className="form-item form-item-field">
                        <label htmlFor="">username</label>
                        <input onChange={handle} name="username" value={formFields.username} type="text" />
                    </div>
                    <div className="form-item form-item-field">
                        <label htmlFor="">password</label>
                        <input
                            name="password"
                            value={formFields.password}
                            type="password"
                            onChange={handle} />
                    </div>
                    <div className="form-item form-item-submit">
                        <input type="submit" value="Submit" />
                    </div>
                    <div className="form-item form-item-footer">
                        <span>
                            Don't have an account ? <Link to="/signup">signup</Link>
                        </span>
                    </div>
                </form>
            </article>
        </section>
    )
}
export default Login