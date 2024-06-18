import './Profile.css'
import { useEffect, useState } from "react";
import { api } from "../../lib/requestHandler";
import { useUser } from "../../context/UserContext";


export function ProfileUsr(props) {
    const {userId} = useUser()
    const [userData, setUserData] = useState(null)


    useEffect(() => {
        api.get(`users/${userId}`).then(
            (response) => {
                if (response.status === 200) {
                    setUserData(response.data)
                }
            }
        ).catch((error) => {
            toast.error('An error occurred')
            navigate('/auth/login')
        }
        )
    }, [])

    return (
        <>
            {
                userData ?
                    <div className="prof-cont">
                        <div className="banner">
                        </div>
                        <div className="profile-div">
                            <h3>Name</h3>
                            <p>{userData.first_name} {userData.last_name}</p>
                            <h3>Email</h3>
                            <p>{userData.email}</p>
                            <h3>Phone number</h3>
                            <p>{userData.phone_number}</p>
                        </div>
                    </div>
                    :
                    <p>Loading...</p>
            }
        </>
    )
}
