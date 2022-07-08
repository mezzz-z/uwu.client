import { useContext } from 'react'
import socketContext from './context.js'
export default function useSocket(){
    return useContext(socketContext)
}