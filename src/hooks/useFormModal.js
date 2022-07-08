import { useState } from "react"
import { useAuth } from '../context/index'

const useFormModal = () => {

    const [ state, setState ] = useState({openModal: false, modalClassName: '', content: ''})
    const { auth, setIsModalOpen } = useAuth()

    
    const setModal = (content, success) => {
        const modalClassName = success ? 'success' : 'danger'
        setState({
            modalClassName,
            content,
            openModal: true
        })
    }

    const removeModal = (delay=0) => {
        setTimeout(() => {
            if(auth.isModalOpen) setIsModalOpen(false)
            setState({openModal: false, modalClassName: '', content: ''})
        }, delay)
    }

    return {modalState: state, setModal, removeModal}
}

export default useFormModal