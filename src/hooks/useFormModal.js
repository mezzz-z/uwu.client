import { useState } from "react"
import { useAuth } from '../context/index'

const initial = {
    openModal: false,
    modalClassName: '',
    content: '',
    onHide: null
}

const useFormModal = () => {

    const [ state, setState ] = useState(initial)
    const { auth, setIsModalOpen } = useAuth()

    
    const setModal = (content, success, onHide = null) => {
        setState({
            ...state,
            modalClassName: success ? 'success' : 'danger',
            onHide: onHide && typeof onHide === 'function' ? onHide : null,
            content,
            openModal: true
        })
    }

    const removeModal = (delay=0) => {
        setTimeout(() => {
            if(auth.isModalOpen) setIsModalOpen(false)
            if(state.onHide) state.onHide()
            setState(initial)
        }, delay)
    }

    return {
        modalState: {
            openModal: state.openModal,
            modalClassName: state.modalClassName,
            content: state.content
        },
        setModal,
        removeModal,
    }
}

export default useFormModal