import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../lib/requestHandler";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import { toast } from "sonner";
import userAvatarIcon from '../assets/user-avatar.svg'
import editIcon from '../assets/edit.svg'
import '/appointment_doc.jpg'


export function Profile(props) {
    const navigate = useNavigate()
    const { userId } = useUser()
    const [isDisabled, setIsDisabled] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [formData, setFormData] = useState({
        profile_image: null,
        consultation_fee: '',
        about: '',
    })
    const [userData, setUserData] = useState(null)
    const [file, setFile] = useState(null)
    const [basicPopupOpen, setBasicPopupOpen] = useState(false)
    const [contactPopupOpen, setContactPopupOpen] = useState(false)
    const [aboutPopupOpen, setAboutPopupOpen] = useState(false)
    const [basicInfoChange, setBasicInfoChange] = useState({})
    const [specialtiesData, setSpecialtiesData] = useState(null)
    const [aboutInfoChange, setAboutInfochange] = useState({})
    const [facilityPopup, setFacilityPopup] = useState(false)
    const [facilityFormPopup, setFacilityFormPopup] = useState(false)
    const [counties, setCounties] = useState(null)
    const [countyLocations, setCountyLocations] = useState(null)
    const [facilityForm, setFacilityForm] = useState({"county": 47})
    const [healthcareFacilities, setHealthcareFacilities] = useState(null)

    useEffect(() => {
        api.get(`doc-profile/${userId}`).then(
            (response) => {
                if (response.status === 200) {
                    setUserProfile(response.data)
                }
            }
        ).catch((error) => {
            if (error.response.status === 404) {
                setUserProfile({})
            }
            else{
                toast.error('An error occurred while fetching your profiile')
            }
        })
    },[])

    useEffect(() => {
        api.get(`doctors/${userId}`).then(
            (response) => {
                if (response.status === 200) {
                    setUserData(response.data)
                }
            }
        ).catch ((error) => {
            toast('an error occurred')
            navigate('/auth/login')
        })
    }, [])

    useEffect(() => {
        api.get(`specialties`).then(
            (response) => {
                if (response.status === 200) {
                    setSpecialtiesData(response.data)
                }
            }
        ).catch((error) => {
            toast.error('An error occurred')
        }
        )
    }, [])

    useEffect(() => {
        api.get('counties').then(
            (response) => {
                if (response.status === 200) {
                    setCounties(response.data)
                }
            }
        ).catch((error) => {
            toast.error('An error occured while fetching your data')
        })
    }, [])

    useEffect(() => {
        api.get('facilities').then((response) => {
            setHealthcareFacilities(response.data)
        }).catch(() => {
            toast.error('An error occurred while fetching your data')
        })
    }, [])

    console.log(facilityForm.county)
    useEffect(() => {
        api.get(`locations/${facilityForm.county}`).then((response) => {
            if (response.status === 200) {
                setCountyLocations(response.data)
            }
        })
    }, [])

    const handleChange = (event) => {
        const {name,  value, files} = event.target
        if (name === 'profile_image' && files && files.length > 0) {
            setSelectedFile(files[0])
        }
        else {
            setFormData({
                ...formData, [name]: value
            })
        }
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
        const payload = {
            "profile_image": event.target.files[0]
        }

        const submitFile = () =>{
            api.put(`doc-profile/${userId}`, payload,
                {
                    headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                    'Content-Type': 'multipart/form-data'
                } }).then((response) => {
                        if (response.status === 201) {
                        setUserProfile(response.data)
                        }
                    }
                )
                .catch((error) => {
                    if (error.response.status === 401) {
                        api.post('refresh-token', {}, {withCredentials: true,  headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                        } }).then( (response) => {
                            if (response.status === 200) {
                                const a_token = response.data.new_a_token
                                localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                                submitFile()
                            }
                        }
                        ).catch((error) => {
                            navigate('/auth/login')
                        }
                        )
                    }
                    if (error.response.status === 400) {
                        setIsDisabled(false)
                        toast.error('please select an image to upload')
                    }
                    if (error.response.status === 500) {
                        setIsDisabled(false)
                        toast.error('There was an error submitting your details. Try again later')
                    }
                    if (error.response.status === 403) {
                        toast.error("an error occurred")
                        setIsDisabled(false)
                    }
            }
            )
        }

        submitFile()
    }


    const handleSubmitBasicInfo = (event) => {
        event.preventDefault()
        
        const payload = basicInfoChange
        const modifyBasicUserInfo = () => {
            api.put(`doctors/${userId}`, payload,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    setUserData(response.data)
                    toast.success('details updated successfully')
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            modifyBasicUserInfo()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
                else if (error.response.status === 400) {
                    toast.error('you have not made any changes or have invalid inputs')
                }
            }
            )
        }
        modifyBasicUserInfo()
        setBasicPopupOpen(false)
    }

    const handleSubmitAboutInfo = () => {
        const payload = aboutInfoChange 

        const modifyUserAbout = () => {

            api.put(`doc-profile/${userId}`, payload, 
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    setUserProfile(response.data)
                    toast.success('details updated successfully')
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            modifyUserAbout()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
                else if(error.response.status === 400) {
                    toast.error('you have not made any changes or have invalid input')
                }
            })
        }
        modifyUserAbout()
        setAboutPopupOpen(false)
    }

    const handleBasicInfoChange =(event) => {
        const {name, value} = event.target
        setBasicInfoChange({
            ...basicInfoChange, [name]: value
        })
    }

    const handleAboutInfoChange = (event) => {
        const {name, value} = event.target
        setAboutInfochange({
            ...aboutInfoChange, [name]: value
        })
    }

    const handleFacilityFormChange = (event) => {
        const {name, value} = event.target
        setFacilityForm({
            ...facilityForm, [name]: value
        })
    }

    const submitFacilityInfo = () => {
        api.post('facilities', facilityForm).then((response) => {
            if (response.status === 201) {
                toast.success('Facility created successfully')
                setFacilityFormPopup(false)
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                toast.error('Check the data, some data is missing')
            }
            else {
                toast.error('An error occurred, try again later')
                setFacilityFormPopup(false)
            }
        })
    }


    const postFacility = () => {
        api.put(`doctors/${userId}`, basicInfoChange,
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                }
            }
        ).then((response) => {
            if (response.status === 200) {
                setFacilityPopup(false)
                setUserData(response.data)
                toast.success('details updated successfully')
            }
        }).catch((error) => {
            if (error.response.status === 401) {
                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then( (response) => {
                    if (response.status === 200) {
                        const a_token = response.data.new_a_token
                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                        postFacility()
                    }
                }
                ).catch((error) => {
                    navigate('/auth/login')
                }
                )
            }
            else if (error.response.status === 400) {
                toast.error('you have not made any changes or have invalid inputs')
            }
        }
        )
    }

    return (
        <>
            <div className="profile-cont">
                {
                    userProfile && userData ?
                    <>
                        <h2>{`${userData.title}. ${userData.first_name} ${userData.last_name}`}</h2>
                        <h3>Booking Link:  <span className="booking-link">{`https://veridoctor.com/book-doc/${userId}`}</span> </h3>
                        <div className="profile-section">
                            <div className="profile-img-cont">
                                <img src={userProfile ? `${userProfile.profile_image ? userProfile.profile_image : userAvatarIcon}` : userAvatarIcon} width={200} height={200} className="profile-image"></img>
                                <label id="file-input">
                                choose a file
                                <input type="file" name="profile_image" className="file-input" accept="image/*" onChange={handleFileChange}></input>
                                </label>
                            </div>
                            <div className="profile-div">
                                <img src={editIcon} 
                                        width={30} 
                                        className="edit-icon" 
                                        onClick={() => {
                                            setBasicPopupOpen(true)}
                                        }
                                >
                                </img>
                                <p><b>Specialty:</b></p>
                                <p>{userData.specialty}</p>
                                <p><b>sub specialty</b></p>
                                <p>{userData.sub_specialty}</p>
                                
                            </div>
                        </div>
                        <div className="profile-div">
                            <img src={editIcon} width={30} className="edit-icon" onClick={() => {setFacilityPopup(true)}}></img>
                            <h3>Healthcare facility</h3>
                            <p>{userData.healthcare_facility ? userData.healthcare_facility.name : 'You have not updated your healthcare facility information'}</p>
                        </div>
                        <div className="profile-div">
                            <img src={editIcon} width={30} height={30} className="edit-icon" onClick={() => {setAboutPopupOpen(true)}}></img>
                            <h3><b>Consultation fees (kshs):</b></h3>
                            <p>{userProfile.consultation_fee}</p>
                            <p><b>About</b></p>
                            <p>{userProfile.about}</p>
                            <p><b>Teleconsultation link</b></p>
                            <p>{userProfile.teleconsultation_link}</p>
                        </div>
                        <div className="profile-div">
                            <h2>Contact Details</h2>
                            <p><b>Email</b></p>
                            <p>{userData.email}</p>
                            <p><b>Phone number</b></p>
                            <p>{userData.phone_number}</p>
                        </div>
                    </>
                    :
                    <p>Loading...</p>
                }
                {
                    basicPopupOpen &&
                    <div className="popup-wrapper">
                        <div className="popup">
                            <h2>Edit your specialty information</h2>
                            <hr></hr>
                            <form className="popup-form" onSubmit={handleSubmitBasicInfo}>
                                    <label>Specialty</label>
                                    <select name="specialty" onChange={handleBasicInfoChange} className="select-input">
                                        <option value="">Select specialty...</option>
                                        {specialtiesData ? (
                                            specialtiesData.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                        ): (<option>Loading data...</option>)}
                                    </select>
                                    <label>Sub specialty</label>
                                    <input name="sub_specialty" defaultValue={userData.sub_specialty} onChange={handleBasicInfoChange}></input>
                            </form>
                            <div className="button-group">
                                <button onClick={() => {setBasicPopupOpen(false)}}>cancel</button>
                                <button onClick={handleSubmitBasicInfo}>save</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    contactPopupOpen &&
                    <div className="popup-wrapper">
                        <div className="popup">
                            <h2>You cannot change your contact information</h2>
                            <hr></hr>
                            <form className="popup-form">
                                    <label>Email</label>
                                    <input name="email" value={userData.email}></input>
                                    <label>Phone number</label>
                                    <input name="phone" value={userData.phone_number}></input>
                            </form>
                            <button onClick={() => {setContactPopupOpen(false)}}>close</button>
                        </div>
                    </div>
                }
                {
                    aboutPopupOpen &&
                    <div className="popup-wrapper">
                        <div className="popup">
                            <h2>Edit your information</h2>
                            <hr></hr>
                            <form className="popup-form" onSubmit={handleSubmitAboutInfo}>
                                    <label>Consultation fees</label>
                                    <input name="consultation_fee" defaultValue={userProfile.consultation_fee} onChange={handleAboutInfoChange}></input>
                                    <label>About</label>
                                    <input name="about" defaultValue={userProfile.about} onChange={handleAboutInfoChange}></input>

                                    <p><b>Teleconsultations</b></p>
                                    <select name="teleconsultation_provider" onChange={handleAboutInfoChange} className="select-input" defaultValue={userProfile.teleconsultation_provider}>
                                        <option value="">select a platform..</option>
                                        <option value="GOOGLE MEET">Google meet</option>
                                        <option value="ZOOM">Zoom</option>
                                    </select>
                                    <label>Enter an open link for teleconsultations</label>
                                    <input name="teleconsultation_link" onChange={handleAboutInfoChange} defaultValue={userProfile.teleconsultation_link}></input>
                            </form>
                            <div className="button-group">
                                <button onClick={() => {setAboutPopupOpen(false)}}>cancel</button>
                                <button onClick={handleSubmitAboutInfo}>save</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    facilityPopup &&
                    <div className="popup-wrapper">
                        <div className="popup">
                            <h2>Select a healthcare facility.</h2>
                            <hr/>
                            <select name="healthcare_facility" className="select-input" onChange={handleBasicInfoChange}>
                                <option value="">Select a healthcare facility...</option>
                                {
                                    healthcareFacilities ?
                                    healthcareFacilities.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                    :
                                    <option>No facility available</option>
                                }
                            </select>
                            <h3>Healthcare Facility not in the list?</h3>
                            <p className="create-fac" onClick={() => setFacilityFormPopup(true)}>Create one</p>
                            <div className="button-group">
                                <button onClick={() => {setFacilityPopup(false)}}>cancel</button>
                                <button onClick={postFacility}>Save</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    facilityFormPopup &&
                    <div className="popup-wrapper">
                        <div className="popup">
                            <h3>Facility information</h3>
                            <hr></hr>
                            <form>
                                <label>Facility name</label>
                                <input name="name" onChange={handleFacilityFormChange}></input>
                                <select  className="select-input" name="county" onChange={handleFacilityFormChange}>
                                    <option value="">Select a county...</option>
                                    {
                                        counties ?
                                        counties.map((item) => (
                                            <option value={item.code} key={item.code}>{item.name}</option>
                                        ))
                                        :
                                        <option>Loading data...</option>
                                    }
                                </select>
                                {/* SHOW the div below only after the county has been selected: Not implemente because chrome does not support option click events*/}
                                <select  className="select-input" name="location" onChange={handleFacilityFormChange}>
                                    <option value="">Select a location...</option>
                                    {
                                        countyLocations ?
                                        countyLocations.map((item) => (
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))
                                        :
                                        <option value="">Select a county first...</option>
                                    }
                                </select>
                                <label>location address </label>
                                <input name="location_address" onChange={handleFacilityFormChange}></input>           
                                <label>licence number</label>
                                <input name="licence_number" onChange={handleFacilityFormChange}></input>   
                            </form>
                            <div className="button-group">
                                <button onClick={() => {setFacilityFormPopup(false)}}>close</button>
                                <button onClick={submitFacilityInfo}>Save</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}