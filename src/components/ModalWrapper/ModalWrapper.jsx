import { useEffect, useReducer, useState, useRef } from 'react'
import ModalWrapperContext from './context.js'
const animationDelay = 500
const ModalWrapper = ({
    children,
    autoHideModal,
    hideModalCallback,
    autoHideModalDelay,
    showHideModalCountDown, 
    hideModalOnCoverClick,
    freeze, // modal will hide, but animation will not apply to it
    transparentCover
}) => {
    // styles
    const initialState = {
        modalState: {
            left: 20,
            opacity: 0,
            scale: .2,
            transition: `${animationDelay}ms`,
            zIndex: '-99999',
            top: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%) scale(.5)',
            minWidth: '200px',
            maxWidth: '800px',
            maxHeight: '500px',
            overflowY: 'scroll',
            overflowX: 'hidden'
        },
        bodyCoverState: {
            left: '0',
            top: '0',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: transparentCover ? 'rgba(0, 0, 0, 0.911)' : 'black',
            opacity: '0',
            zIndex: '-1'
        }
    }

    const animationReducer = (state, action) => {
        switch (action.type) {
            case 'modal-wrapper/showModal':
                return {
                    ...state,
                    modalState: {
                        ...state.modalState,
                        left: "50%",
                        opacity: 1,
                        zIndex: 9999999,
                        transform: 'translate(-50%, -50%) scale(1)'
                    },
                    bodyCoverState: {
                        ...state.bodyCoverState,
                        opacity: 1,
                        zIndex: 999999
                    }
                }
            case 'modal-wrapper/hideModal':
                return initialState
    
            default: return initialState
        }
    }
    const [state, dispatch] = useReducer(animationReducer, initialState)
    const [hideModalCountDown, setHideModalCountDown] = useState((autoHideModalDelay || 3000) - 1000)
    const hideModalCountDownRef = useRef(null)
    const autoHideModalTimeoutRef = useRef(null)

    const startCountDown = () => {
        hideModalCountDownRef.current = setInterval(() => {
            setHideModalCountDown(state => {
                if(( state - 1000) <= 0) return 0
                return state - 1000
            })
        }, 1000)
    }

    const hideModal = () => {
        if(!freeze) {
            dispatch({type: 'modal-wrapper/hideModal'})
        }

        if(hideModalCallback && typeof hideModalCallback === 'function') {
            setTimeout(() => {
                hideModalCallback()
                // this call back will be set from inner component
            }, animationDelay)
        }
    }

    useEffect(() => {
        dispatch({type: 'modal-wrapper/showModal'})

        if(autoHideModal) {
            autoHideModalTimeoutRef.current = setTimeout(() => {
                hideModal()
            }, autoHideModalDelay || 3000)
        }

        if(showHideModalCountDown && hideModalCountDown && autoHideModal) {
            startCountDown()
        }

        return () => {
            clearInterval(hideModalCountDownRef.current)
            clearTimeout(autoHideModalTimeoutRef.current)
        }
    }, [])

    return (
        <ModalWrapperContext.Provider value={{hideModal}}>
            <div onClick={hideModalOnCoverClick ? hideModal : undefined} className="body-cover" style={{...state.bodyCoverState}}></div>
            <div className="modal-wrapper" style={{...state.modalState}}>
                {showHideModalCountDown && autoHideModal
                    ?   <span className="float-corner float-corner-bottom-left">{hideModalCountDown / 1000}</span>
                    :   null}

                {children}
            </div>
        </ModalWrapperContext.Provider>
    )
}

export default  ModalWrapper