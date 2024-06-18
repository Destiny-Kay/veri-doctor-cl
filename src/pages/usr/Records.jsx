import { useEffect, useState } from "react"
import { api } from "../../lib/requestHandler"
import { useUser } from "../../context/UserContext"
import {useNavigate} from "react-router-dom"
import './Records.css'
import { RecordCard } from "../../components/RecordCard"


export function Records() {
    const {userId} = useUser()
    const [records, setRecords] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        const getRecords = () => {
            api.get(`patients/${userId}/records`, { headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then(
                        (response) => {
                            if (response.status === 200) {
                                setRecords(response.data)
                            }
                        }
                ).catch((error) => {
                    if (error.response.status === 401) {
                        api.post('refresh-token', {}, {withCredentials: true,  headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                        } }).then( (response) => {
                            if (response.status === 200) {
                                const a_token = response.data.new_a_token
                                localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                                getRecords()
                            }
                        }
                        ).catch(() => {
                            navigate('/auth/login')
                        }
                        )
                    }
                })
        }
        getRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="record-container">
            {
                records ? 
                records.data.length > 0 ?
                    records.data.map((item) => (
                        <RecordCard key={item.id} type={item.type} description={item.description} files={item.files} record_id={item.id}/>
                    ))
                :
                    <h3>No records for this period</h3>
                :
                <p>Loading data...</p>
            }
        </div>
    )
}
