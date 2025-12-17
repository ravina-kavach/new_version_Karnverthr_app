import React, { useState } from 'react'

const useSignInScreen = () => {
    const [visibleModal, setVisibleModel] = useState(false)
 
    const closeModal = () => {
        setVisibleModel(!visibleModal)
    }

    return {
        visibleModal,
        closeModal
    }
}


export default useSignInScreen;