import { useContext } from 'react'
import CurrentRoomContext from './context.js'

export default function useCurrentRoom(){
    return useContext(CurrentRoomContext)
}