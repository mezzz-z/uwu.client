import { useState } from 'react'
import HandleInputs from '../helpers/HandleInputs'
import authAPI from '../api/auth.js'
import useFormModal from '../hooks/useFormModal'
import Modal from '../components/FormModal.jsx'
import { Link } from 'react-router-dom'

const Login = () => {

    const [ formFields, setFormField ] = useState({username: '', password: '', email: ''})
    const { handle } = new HandleInputs(setFormField, formFields)
    const { modalState, setModal, removeModal } = useFormModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!formFields.username || !formFields.password || !formFields.email) setModal('Fields cannot be empty', false)

        try {
            const { data: { message } } = await authAPI.signup(formFields.username, formFields.password, formFields.email)
            setModal(message, true)

        } catch (err) {
            const errMessage = err.response.data.message || 'Something went wrong'
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
                        <h3 className="title">Signup</h3>
                    </div>
                    <div className="form-item form-item-field">
                        <label htmlFor="">username</label>
                        <input onChange={handle} name="username" value={formFields.username} type="text" />
                    </div>
                    <div className="form-item form-item-field">
                        <label htmlFor="">email</label>
                        <input onChange={handle} name="email" value={formFields.email} type="email" />
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
                            Already have an account ? <Link to="/login">login</Link>
                        </span>
                    </div>
                </form>
            </article>
        </section>
    )
}
export default Login