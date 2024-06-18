import { useState, createContext, useContext, useEffect } from "react"


const UserContext = createContext()

export const UserProvider = ({children}) => {

    const [userId, setUserId] = useState(() => {
        const stored_id = window.localStorage.getItem('user_id')
        return stored_id ? JSON.parse(stored_id) : null
    })

    const [userData, setUserData] = useState(() => {
        const storedUserData = window.localStorage.getItem('user_data')
        return storedUserData ? JSON.parse(storedUserData) : null
    })

    useEffect(() => {
        window.localStorage.setItem('user_data', JSON.stringify(userData))
    }, [userData])

    useEffect(() => {
        window.localStorage.setItem('user_id', JSON.stringify(userId))
    }, [userId])


    return (
        <UserContext.Provider value={{userId, setUserId, userData, setUserData}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
