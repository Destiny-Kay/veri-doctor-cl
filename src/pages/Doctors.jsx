import { AppLayout } from "../layouts/AppLayout"
import { DoctorCard } from "../components/DoctorCard"
import './index.css'
import { useEffect, useState } from "react"
import { api } from "../lib/requestHandler"
import { SearchBar } from "../components/SearchBar"
import userAvatar from '../assets/user-avatar.svg'
import { DoctorCardSkeleton } from "../components/DoctorCardSkeleton"
import { useSearch } from "../context/SearchContext"
import { toast } from "sonner"


export function Doctors(props) {
    const {searchResults} = useSearch()
    const [doctorsData, setDoctorsData] = useState(null)

    useEffect(() => {
        const fetchDoctors = () => {
            if (searchResults) {
                setDoctorsData(null)
                return setDoctorsData(searchResults)
            }
                api.get('doctors').then(
                    (response) => {
                        if (response.status === 200) {
                            setDoctorsData(response.data)
                        }
                    }
                ).catch((error) => {
                    toast.error('An error occurred while fetching doctors')
                })
        }

        fetchDoctors()
    },[searchResults])

    console.log(doctorsData)

    return(
            <AppLayout>
                <div className="doc-cont">
                    <h2 className="blue-heading">SEARCH FOR A DOCTOR NEAR YOU</h2>
                    <SearchBar />
                    <div className="grid">
                        {
                            doctorsData ?
                                doctorsData.data.length <= 0 ?
                                    <h3>No doctors matched your query</h3>
                                    :
                                doctorsData.data.map((item) => (
                                    <DoctorCard 
                                        key={item.id}
                                        title={item.title}
                                        first_name={item.first_name}
                                        last_name={item.last_name}
                                        specialty = {item.specialty}
                                        sub_specialty= {item.sub_specialty}
                                        healthcare_facility = {item.healthcare_facility}
                                        doc_id={item.id}
                                        doc_image={item.profile_data && item.profile_data.profile_image ? item.profile_data.profile_image : userAvatar}
                                        consultation_fee={item.profile_data && item.profile_data.consultation_fee ? item.profile_data.consultation_fee : ''}
                                        />
                                        )
                                    ) : 
                                    <>
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                        <DoctorCardSkeleton />
                                    </>
                        }
                    </div>
                </div>
            </AppLayout>
    )
}

