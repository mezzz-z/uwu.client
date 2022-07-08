import { useContext } from 'react'
import ModalWrapperContext from './context.js'
export default function useModalWrapper(){
    return useContext(ModalWrapperContext)
}