import { useContext } from 'react'
import UserContext from './context.js'

export default function useUser(){
    return useContext(UserContext)
}