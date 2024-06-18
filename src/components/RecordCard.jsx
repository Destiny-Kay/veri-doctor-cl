import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../lib/requestHandler"
import { useUser } from "../context/UserContext"

export function RecordCard (props) {
    const [documentsPopup, setDocumentsPopup] = useState(false)
    const [recordFiles, setRecordFiles] = useState(null)
    const {userId} = useUser()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchFiles = () => {
            api.get(`patients/${userId}/records/${props.record_id}/files`, { withCredentials: true,
                headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                'Content-Type': 'multipart/form-data'
            } }).then((response) => {
                setRecordFiles(response.data)
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            fetchFiles()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
            })
        }

        fetchFiles()
    }, [])

    return (
        <>
            <div className="record-div">
                            <h4>{props.type}</h4>
                            <p>{props.description}</p>
                            {
                                !documentsPopup ? 
                                    <button className="button" onClick={() => setDocumentsPopup(true)}>View documents</button>
                                    :
                                    <button className="button" onClick={() => setDocumentsPopup(false)}>close</button>
                            }
                            {
                                documentsPopup &&
                                <div className="document-cont">
                                    <h4>Documents from this visit</h4>
                                    <hr></hr>
                                    {
                                        recordFiles.length > 0 ?
                                        recordFiles.map((fileinstance, index) => (
                                            <div key={index}>
                                                <Link to={fileinstance.file}>{fileinstance.file}</Link>
                                            </div>
                                        ))
                                        :
                                        <p>No files were submitted for this appointment</p>
                                    }
                                </div>
                            }
            </div>
        </>
    )
}
