import './AppointmentCard.css'
import userAvatarIcon from '../assets/user-avatar.svg'
import uploadIcon from '../assets/upload.svg'
// import SuccessIcon from '../assets/success-check.svg'
import fileIcon from '../assets/file.svg'
import closeIcon from '../assets/close.svg'
import { useEffect, useState } from 'react'
import { api } from '../lib/requestHandler'
import moment from 'moment'
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom'


export function AppointmentCard(props) {
    const [appointmentPopup, setAppointmentPopup] = useState(false)
    const [patientVitals, setPatientVitals] = useState(null)
    const [detailPopup, setDetailPopup] = useState(false)
    const [updateVItalsPopup, setUpdateVItalsPopup] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [fileToAdd, setFileToAdd] = useState(null)
    const [recordForm, setRecordForm] = useState(null)
    const [vitalsFormData, setVitalsFormData] = useState({})
    const [uploading, setUploading] = useState(false)
    const [isOn, setIsOn] = useState(false);
    const [statusChanged, setStatusChanged] = useState(null)
    const navigate = useNavigate()
    

    useEffect(() => {
        if (fileToAdd != null) {
            setUploadedFiles([...uploadedFiles, fileToAdd])
            setFileToAdd(null)
        }
    }
    ,[fileToAdd])

    const handleToggle = () => {
        setIsOn(true);
        const markAppointmentAttended = () => {
            api.put(`book/${props.appointment_id}/attended`, {}, {
                headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
            } }).then((response) => {
                if (response.status === 200) {
                    toast.success('Appointment marked as attended')
                    setStatusChanged(response.data)
                    return
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            markAppointmentAttended()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
                else{
                    setIsOn(false)
                    return toast.error('An error occurred')
                }
            })
        }
        markAppointmentAttended()
      };
    

    const openAppointmentDetails = () => {
        setAppointmentPopup(true)
        // DO SOME WORK HERE
    }

    const fetchPatientVitals = (id) => {
        api.get(`patients/${id}/vitals`, { withCredentials: true, headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
        } }).then((response) => {
            setPatientVitals(response.data)
        }).catch((error) => {
            if (error.response.status === 401) {
                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then( (response) => {
                    if (response.status === 200) {
                        const a_token = response.data.new_a_token
                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                        fetchPatientVitals()
                    }
                }
                ).catch((error) => {
                    navigate('/auth/login')
                }
                )
            }
            else if (error.response.status === 404) {
                setPatientVitals({})
            }
        })
    }

    const handlePatientVitalsFormChange = (event) => {
        const {name, value} = event.target;
        setVitalsFormData({
            ...vitalsFormData, [name]: value
        })
    }

    const postPatientVitals = () => {
        api.post(`patients/${props.patient.id}/vitals`, vitalsFormData,
        {
            headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
        } }).then((response) => {
            if (response.status === 201) {
                setPatientVitals(response.data)
                toast.success('patient details updated successfully')
                setUpdateVItalsPopup(false)
            }
        }
        ).catch((error) => {
            if (error.response.status === 400) {
                toast.error(`Error: ${Object.entries(error.response.data).map(([key, value]) => {
                    return `${key}: ${value}`
                })}`)
            }

            if (error.response.status === 401) {
                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then( (response) => {
                    if (response.status === 200) {
                        const a_token = response.data.new_a_token
                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                        postPatientVitals()
                    }
                }
                ).catch((error) => {
                    navigate('/auth/login')
                }
                )
            }
        })
    }


    const updatePatientVitals = () => {
        api.put(`patients/${props.patient.id}/vitals`, vitalsFormData,
        {
            headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
            'Content-Type': 'multipart/form-data'
        } }).then((response) => {
            if (response.status === 200) {
                setPatientVitals(response.data)
                toast.success('patient details updated successfully')
                setUpdateVItalsPopup(false)
            }
        }
        ).catch((error) => {
            if (error.response.status === 400) {
                toast.error(`Error: ${Object.entries(error.response.data).map(([key, value]) => {
                    return `${key}: ${value}`
                })}`)
            }

            else if (error.response.status === 401) {
                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then( (response) => {
                    if (response.status === 200) {
                        const a_token = response.data.new_a_token
                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                        updatePatientVitals()
                    }
                }
                ).catch((error) => {
                    navigate('/auth/login')
                }
                )
            }
            
            else{
                toast.error(error)
            }
        })
    }

    const uploadPatientVitals = () => {
        if (Object.keys(patientVitals).length === 0) {
           postPatientVitals()
        }
        else if (Object.keys(patientVitals).length > 0) {
            updatePatientVitals()
        }
    }

    const handleFileSelect =(event) => {
        let file = event.target.files[0]

        if (file) {
            uploadFile(file)
        }
    }

    function uploadFile(file){
        setFileToAdd({
            id: file.id,
            name: file.name,
            fileSize: file.size,
            fileContent: file
        })
    }

    const handleRecordDescChange = (event) => {
        const {name, value} = event.target
        setRecordForm({
            ...recordForm, [name]: value
        })
    }


    const removeFIleElement = (index) => {
        setUploadedFiles((prevItems) => {
            const newUploadedFiles = [...prevItems.slice(0, index), ...prevItems.slice(index + 1)]
            return newUploadedFiles
        })
    }

    const getFileSize = (size) => {
        if (size > 1073741824) {
            return `${Math.round(size/1073741824)} GB`
        }
        if (size > 1048576){
            return `${Math.round(size/1048576)} MB`
        }
        if (size > 1024){
            return `${Math.round(size/1024)} KB`
        }
        else return `${size} B`
    }

    const uploadPatientRecords = () => {
        if (uploadedFiles.length <= 0) {
            return toast.error('please select files to proceed')
        }
        if (recordForm === null) {
            return toast.error('please provide a description')
        }

        const extracted_files = []
        uploadedFiles.forEach(file => {
            extracted_files.push(file.fileContent)
        })

        const payload = new FormData()
        payload.append('patient', props.patient.id)
        payload.append('appointment', props.appointment_id)
        payload.append('description', recordForm.description)
        payload.append('type', recordForm.type)

        uploadedFiles.forEach(file => {
            payload.append('uploaded_files', file.fileContent)
        })
        setUploading(true)
        const postRecords = () => {
            api.post(`patients/${props.patient.id}/records`, payload,
                        { withCredentials: true,
                            headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                            'Content-Type': 'multipart/form-data'
                        } }).then((response) => {
                            if (response.status === 201) {
                                toast.success('patient records uploaded successfully')
                                setUploading(false)
                                setAppointmentPopup(false)
                            }
                        }).catch((error) => {
                            if (!error.response) {
                                toast.error('An error occured while uploading record details')
                                setUploading(false)
                                setAppointmentPopup(false)
                            }
                            if (error.response.status === 400) {
                                toast.error(`Error: ${Object.entries(error.response.data).map(([key, value]) => {
                                    return `${key}: ${value}`
                                })}`)
                                setUploading(false)
                                setAppointmentPopup(false)
                            }
                            if (error.response.status === 401) {
                                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                                } }).then( (response) => {
                                    if (response.status === 200) {
                                        const a_token = response.data.new_a_token
                                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                                        postRecords()
                                    }
                                }
                                ).catch((error) => {
                                    navigate('/auth/login')
                                }
                                )
                            }
                        }
                        )
        }
        postRecords()
    }

    
    const checkFutureDate = () => {
        const timeslotDate = moment(props.date)
        return timeslotDate.isAfter(moment())
    }

    return (
        <>
            <div className='appointment-card'>
                <div className='image-cont'>
                    <img src={userAvatarIcon} width={50}></img>
                    <div>
                        <p>{props.patient.first_name} {props.patient.last_name}</p>
                        {
                            statusChanged ?
                            <>
                            <b><p className={statusChanged.status}>{statusChanged.status}</p></b>
                            </>
                            :
                            <>
                            <b><p className={props.status}>{props.status}</p></b>
                            {
                                !checkFutureDate() &&
                                (props.status === 'PLACED' || props.status === 'RESCHEDULED') &&
                                <div className='toggle-div'>
                                    <p>Mark as attended .</p>
                                    <label className="switch">
                                        <input type="checkbox" checked={isOn} onChange={handleToggle} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            }
                            </>
                        }
                    </div>
                </div>
                <div>
                    <p>{moment(props.date).format('DD MMMM YYYY')}</p>
                    <p>{props.startTime.slice(0, -3)} - {props.endTime.slice(0, -3)}</p>
                    <div className="button-group">
                        {
                            <button className='button' onClick={() => {
                                setDetailPopup(true)
                                fetchPatientVitals(props.patient.id)
                            }}>More</button>
                        }
                        {
                            !checkFutureDate() &&
                            !statusChanged &&
                            (props.status != 'CANCELED' && props.status != 'ATTENDED' ) &&
                                <button  className='button' onClick={openAppointmentDetails}>upload records</button>
                        }
                    </div>
                </div>
            </div>
            {
                appointmentPopup &&
                <div className='appointment-popup'>
                    <div className='appointment-popup-div'>
                        <div>
                            <b>Upload records for {props.patient.first_name} {props.patient.last_name}</b>
                            <hr></hr>
                            <form className='upload-form' encType='multipart/form-data' onSubmit={uploadPatientRecords} method="post">
                                <label className='record-text-input'>
                                    Provide a brief description of the documents
                                    <textarea id='record-description' name='description' onChange={handleRecordDescChange}></textarea>
                                </label>
                                <select name='type' className='type-input' onChange={handleRecordDescChange}>
                                    <option>Select record type...</option>
                                    <option>X-RAY</option>
                                    <option>TREATMENT</option>
                                    <option>PRESCRIPTION</option>
                                </select>
                        
                                <label className='upload-area'>
                                    <input type="file" accept='image/*,.pdf' hidden name="file" className="file-input" onChange={handleFileSelect}></input>
                                    <img src={uploadIcon} height={80} width={300} alt="upload-icon"/>
                                    <p>Browse files to upload</p>
                                </label>
                            </form>
                          
                                <section className="uploaded-area">
                                    {
                                        uploadedFiles &&
                                        uploadedFiles.length >= 1 &&
                                        uploadedFiles.map((item, index) => (
                                        <li className="row" key={index}>
                                            <div className="content">
                                                <img src={fileIcon} width={30} height={30} alt='file icon'></img>
                                                <div className="details">
                                                    <span className="name">{item.name}</span>
                                                    <span className="size">{getFileSize(item.fileSize)}</span>
                                                </div>
                                            </div>
                                        <img src={closeIcon} width={30} height={30} className='remove-icon' alt='remove icon' onClick={() => removeFIleElement(index)}></img>
                                        </li>
                                        ))
                                    }
                                </section>
                        </div>
                        <div>
                            <button className='button' onClick={() => {
                                setAppointmentPopup(false)
                                setUploadedFiles([])
                                }}>cancel</button>
                            {
                                uploading ?
                                <button  className='button-active'>uploading...</button>
                                :
                                <button className='button' onClick={uploadPatientRecords}>save</button>

                            }
                        </div>
                    </div>

                </div>
            }
            {
                detailPopup &&
                <div className='appointment-popup'>
                    <div className="appointment-popup-div">
                        <h3>{props.patient.first_name} {props.patient.last_name}</h3>
                        <hr />
                        {
                            patientVitals ?
                            <div className='vitals-wrapper'>
                                <p>Patient vitals</p>
                                <p>Last recorded: <b>{patientVitals.recorded ? moment(patientVitals.recorded).format('DD MMMM YYYY') : '--'}</b></p>
                                <div className='vitals-grid'>
                                    <div className='vitals-div'> 
                                    <p>Blood pressure(sys/dys)</p>
                                    {
                                        <b  className='vitals-value'>{patientVitals.blood_pressure_systolic ? patientVitals.blood_pressure_systolic.slice(0,-4) : '--'}/{patientVitals.blood_pressure_dystolic ? patientVitals.blood_pressure_dystolic.slice(0,-4) : '--'}</b>
                                    }
                                    <p><i>mm Hg</i></p>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Oxygen saturation</p>
                                    <b  className='vitals-value'>{patientVitals.oxygen_saturation ? patientVitals.oxygen_saturation.slice(0, -4) : '--'}</b>
                                    <p><i>%</i></p>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Respiratory rate</p>
                                    <b  className='vitals-value'>{patientVitals.respiratory_rate ? patientVitals.respiratory_rate : '--'}</b>
                                    <p><i>breaths/m</i></p>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Heart rate</p>
                                    <b  className='vitals-value'>{patientVitals.heart_rate ? patientVitals.heart_rate : '--'}</b>
                                    <p><i>beats/m</i></p>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Blood glucose</p>
                                    <b  className='vitals-value'>{patientVitals.blood_glucose ? patientVitals.blood_glucose.slice(0, -4) : '--'}</b>
                                    <p><i>mmol/L</i></p>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Blood group</p>
                                    <b className='vitals-value'>{patientVitals.blood_group ? patientVitals.blood_group : '--'}</b>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Body weight</p>
                                    <b  className='vitals-value'>{patientVitals.body_weight ? patientVitals.body_weight.slice(0, -4) : '--'}</b>
                                    <p><i>kg</i></p>
                                </div>
                                <div className='vitals-div'> 
                                    <p>Height</p>
                                    <b  className='vitals-value'>{patientVitals.height ? patientVitals.height.slice(0, -4) : '--'}</b>
                                    <p><i>m</i></p>
                                </div>
                                </div>
                            </div>
                            :
                            <p>Loading...</p>
                        }
                        <button  className='button' onClick={() => setDetailPopup(false)}>close</button>
                        {
                            !checkFutureDate() &&
                            (props.status != 'CANCELED' && props.status != 'ATTENDED') &&
                            <button  className='button' onClick={() => setUpdateVItalsPopup(true)}>update</button>
                        }

                        {
                            updateVItalsPopup &&
                            <div className='appointment-popup'>
                                <div className="appointment-popup-div h-80">
                                    <h3>Update health vitals for {props.patient.first_name} {props.patient.last_name}</h3>
                                    <hr />
                                    <form className='vitals-form'>
                                        <label className='form-label'>
                                            Blood pressure systolic<b>(mm/Hg)</b>
                                            <input className='form-input' type='number' step='0.01' name='blood_pressure_systolic' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.blood_pressure_systolic && patientVitals.blood_pressure_systolic.slice(0, -4)}></input>
                                        </label>
                                        <label className='form-label'>
                                            Blood pressure dystolic<b>(mm/Hg)</b>
                                            <input className='form-input' type='number' step='0.01' name='blood_pressure_dystolic' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.blood_pressure_dystolic && patientVitals.blood_pressure_dystolic.slice(0, -4)}></input>
                                        </label>
                                        <label className='form-label'>
                                            Oxygen saturation<b>(%)</b>
                                            <input className='form-input' type='number' step='0.01'  name='oxygen_saturation' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.oxygen_saturation && patientVitals.oxygen_saturation.slice(0, -4)}></input>
                                        </label>
                                        <label className='form-label'>
                                            Respiratory rate<b>(breaths/m)</b>
                                            <input className='form-input' type='number'  name='respiratory_rate' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.respiratory_rate && patientVitals.respiratory_rate}></input>
                                        </label>
                                        <label className='form-label'>
                                            Heart rate<b>(beats/m)</b>
                                            <input className='form-input' type='number'  name='heart_rate' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.heart_rate && patientVitals.heart_rate}></input>
                                        </label>
                                        <label className='form-label'>
                                            Blood glucose<b>(mmol/L)</b>
                                            <input className='form-input' type='number' step='0.01'  name='blood_glucose' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.blood_glucose && patientVitals.blood_glucose.slice(0,-4)}></input>
                                        </label>
                                        <label className='form-label'>
                                        Blood group
                                        {
                                            patientVitals.blood_group ? 
                                            <input className='form-input' value={patientVitals.blood_group}></input>
                                            :
                                                <select name='blood_group' onChange={handlePatientVitalsFormChange}>
                                                    <option>Select a blood group...</option>
                                                    <option>A POSITIVE</option>
                                                    <option>A NEGATIVE</option>
                                                    <option>B POSITIVE</option>
                                                    <option>B NEGATIVE</option>
                                                    <option>AB POSITIVE</option>
                                                    <option>AB NEGATIVE</option>
                                                    <option>O POSITIVE</option>
                                                    <option>O NEGATIVE</option>
                                                </select>
                                        }
                                        </label>
                                        <label className='form-label'>
                                            Body weight<b>(kg)</b>
                                            <input className='form-input' type='number' step='0.01'  name='body_weight' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.body_weight && patientVitals.body_weight.slice(0, -4)}></input>
                                        </label>
                                        <label className='form-label'>
                                            Height<b>(m)</b>
                                            <input className='form-input' type='number' step='0.01' name='height' onChange={handlePatientVitalsFormChange} defaultValue={patientVitals.height && patientVitals.height.slice(0, -4)}></input>
                                        </label>
                                    </form>
                                    <button  className='button' onClick={() => setUpdateVItalsPopup(false)}>close</button>
                                    <button  className='button' onClick={uploadPatientVitals}>save</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}