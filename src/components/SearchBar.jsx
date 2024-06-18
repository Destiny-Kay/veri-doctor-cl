import './SearchBar.css'
import searchIcon from '../assets/search-icon.svg'
import { useState, useEffect } from 'react'
import { api } from '../lib/requestHandler'
import closeIcon from '../assets/close.svg'
import { useSearch } from '../context/SearchContext'
import {toast} from 'sonner'



export function SearchBar() {
    const {setSearchResults} = useSearch()
    const [searchFilter, setSearchFilter] = useState({
        specialty: 'all',
        location: 'all',
        facility: 'all'
    })
    const [specialties, setSPecialties] = useState(null)
    const [locations, setLocations] = useState(null)
    const [facilities, setFacilities] = useState(null)
    const [searchDropdown, setSearchDropdown] = useState(false)
    const [activeSearchItem, setActiveSearchItem] = useState(null)
    const [mobileSearchDropdown, setMobileSearchDropdown] = useState(false)
    const [mobileSpecialtyActive, setMobileSpecialtyActive] = useState(false)
    const [mobileLocationActive, setMobileLocationActive] = useState(false)
    const [mobileFacilityActive, setMobileFacilityActive] = useState(false)


    useEffect(() => {
        api.get('specialties').then(
            (response) => {
                if (response.status === 200) {
                    setSPecialties(response.data)
                }
            }
        ).catch((error) => {
            if (error.response.status === 404) {
                setSPecialties([])
            }
        })

    }, [])

    useEffect(() => {
        api.get('locations').then(
            (response) => {
                if (response.status === 200) {
                    setLocations(response.data)
                }
            }
        ).catch((error) => {
            if (error.response.status === 404) {
                setLocations([])
            }
        })
    }, [])


    useEffect(() => {
        api.get('facilities').then(
            (response) => {
                if (response.status === 200) {
                    setFacilities(response.data)
                }
            }
        ).catch((error) => {
            if (error.response.status === 404) {
                setFacilities([])
            }
        })
    }, [])

    const handleSearch = () => {
        api.post(`search?specialty=${searchFilter.specialty}&location=${searchFilter.location}&facility=${searchFilter.facility}`).then(
            (response) => {
                if (response.status === 200) {
                    setSearchResults(response.data)
                }
            }
        ).catch(() => {
            toast.error('An error occurred')
        })
        setSearchDropdown(false)
    }

    useEffect(() => {
        api.post(`search?specialty=${searchFilter.specialty}&location=${searchFilter.location}&facility=${searchFilter.facility}`).then(
            (response) => {
                if (response.status === 200) {
                    setSearchResults(response.data)
                }
            }
        ).catch(() => {
            toast.error('An error occurred')
        })
        setSearchDropdown(false)
    }, [searchFilter])


    const mapSearchData = (activeItem) => {
        let searchData = null
        if (activeItem === 'specialty') {
            searchData = specialties
            const searchTag = document.getElementById('search-specialty')

            return(
                searchData ?
                <div className='search-dropdown-wrapper'>
                    <div className='search-dropdown'>
                        <p><b>Select a specialty</b></p>
                        <ul>
                            <li className='search-item' onClick={() => {
                                searchTag.textContent = 'All'
                                setSearchFilter({...searchFilter, specialty: 'all'})
                                setSearchDropdown(false)
                            }}>All</li>
                            {
                                searchData.map((item) => (
                                    <li className='search-item' key={item.id} onClick={() => {
                                        searchTag.textContent = item.name
                                        setSearchFilter({...searchFilter, specialty: item.id})
                                        setSearchDropdown(false)
                                    }}>{item.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                :
                <></>
            )
        }


        else if (activeItem === 'location') {
            searchData = locations
            const searchTag = document.getElementById('search-location')
            return(
                searchData ?
                <div className='search-dropdown-wrapper'>
                    <div className='search-dropdown'>
                        <p><b>Select a location</b></p>
                        {/* <img src={closeIcon} width={20} className='close-icon'></img> */}
                        <ul>
                            <li className='search-item' onClick={() => {
                                searchTag.textContent = 'All'
                                setSearchFilter({...searchFilter, location: 'all'})
                                setSearchDropdown(false)
                            }}>All</li>
                            {
                                searchData.map((item) => (
                                    <li className='search-item' key={item.code} onClick=  {() => {
                                        searchTag.textContent = item.name
                                        setSearchFilter({...searchFilter, location: item.id})
                                        setSearchDropdown(false)
                                    }}>{item.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                :
                <></>
            )

        }

        else if (activeItem === 'facility') {
            searchData = facilities
            const searchTag = document.getElementById('search-facility')
            return(
                searchData ?
                <div className='search-dropdown-wrapper'>
                    <div className='search-dropdown'>
                        <p><b>Select a facility</b></p>
                        <ul>
                            <li className='search-item' onClick={() => {
                                searchTag.textContent = 'All'
                                setSearchFilter({...searchFilter, facility: 'all'})
                                setSearchDropdown(false)
                            }}>All</li>
                            {
                                searchData.map((item) => (
                                    <li className='search-item' key={item.id}
                                    onClick={() => {
                                        searchTag.textContent = item.name
                                        setSearchFilter({...searchFilter, facility: item.id})
                                        setSearchDropdown(false)
                                    }}>{item.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                :
                <></>
            )
        }
    }

    return (
        <>
            <div className="search-wrapper">
                    <form className="search" autoComplete="off">
                        <div className="search-section-wrapper">
                            <div className="search-section"
                                onClick={() => {
                                    setSearchDropdown(true)
                                    setActiveSearchItem('specialty')
                                }}>
                                <h2>Specialty</h2>
                                <p id='search-specialty'>Select a specialty</p>
                            </div>
                        </div>

                        <div className="search-section-wrapper">
                            <div className="search-section"
                                onClick={() => {
                                    setSearchDropdown(true)
                                    setActiveSearchItem('location')
                                }}
                            >
                                <h2>Location</h2>
                                <p id='search-location'>Where are you from</p>
                            </div>
                        </div>

                        <div className="search-section-wrapper">
                            <div className="search-section"
                                onClick={() => {
                                    setSearchDropdown(true)
                                    setActiveSearchItem('facility')
                                }}
                            >
                                <h2>Facility</h2>   
                                <p id='search-facility'>Select a facility</p>
                                {/* <input type="text" placeholder="search for a facility" name="specialty"/>    */}
                            </div>
                        </div>

                        <div className="search-section">
                            <img src={searchIcon} onClick={handleSearch} alt='search-icon'></img>
                        </div>
                    </form>
            </div>

            <div className="search-mobile-wrapper">
                <div className="search-mobile" onClick={() => setMobileSearchDropdown(true)}>
                    <img src={searchIcon} alt='search-icon'></img>
                    <div>
                        <h2>Search</h2>
                        <p>search for a doctor</p>
                    </div>
                </div>
            </div>
                {
                    searchDropdown &&
                        mapSearchData(activeSearchItem)
                }
                {
                    mobileSearchDropdown &&
                    <div className='search-div-mobile'>
                        <img src={closeIcon} alt='close-icon' className='close-icon-mobile' onClick={() => {setMobileSearchDropdown(false)}}></img>
                        <div className='search-item-mobile' onClick={() => {
                            setMobileSpecialtyActive(initial => !initial)
                            setMobileLocationActive(false)
                            setMobileFacilityActive(false)
                            }}>
                            <p>specialty</p>
                        </div>
                        { mobileSpecialtyActive &&
                            <div className='search-item-mobile-list'>
                                <li onClick={() => {
                                            setMobileSpecialtyActive(false)
                                            setSearchFilter({...searchFilter, specialty: 'all'})
                                        }} >All</li>
                                {
                                    specialties.map((item) => (
                                        <li onClick={() => {
                                            setMobileSpecialtyActive(false)
                                            setSearchFilter({...searchFilter, specialty: item.id})
                                        }} key={item.id}>{item.name}</li>
                                    ))
                                }
                            </div>
                        }
                        <div className='search-item-mobile' onClick={() => {
                            setMobileLocationActive(initial => !initial)
                            setMobileFacilityActive(false)
                            setMobileSpecialtyActive(false)
                            }}>
                            <p>location</p>
                        </div>
                        { mobileLocationActive &&
                            <div className='search-item-mobile-list'>
                                <li onClick={() => {
                                            setMobileLocationActive(false)
                                            setSearchFilter({...searchFilter, location: 'all'})
                                        }} >All</li>
                                {
                                    locations.map((item) => (
                                        <li onClick={() => {
                                            setMobileLocationActive(false)
                                            setSearchFilter({...searchFilter, location: item.code})
                                        }} key={item.code}>{item.name}</li>
                                    ))
                                }
                            </div>

                        }
                        <div className='search-item-mobile' onClick={() => {
                            setMobileFacilityActive(initial => !initial)
                            setMobileLocationActive(false)
                            setMobileSpecialtyActive(false)
                        }}>
                            <p>facility</p>
                        </div>
                        { mobileFacilityActive &&
                            <div className='search-item-mobile-list'>
                                <li onClick={() => {
                                            setMobileFacilityActive(false)
                                            setSearchFilter({...searchFilter, facility: 'all'})
                                        }} >All</li>
                                {
                                    facilities.map((item) => (
                                        <li onClick={() => {
                                            setMobileFacilityActive(false)
                                            setSearchFilter({...searchFilter, facility: item.id})
                                        }} key={item.id}>{item.name}</li>
                                    ))
                                }
                            </div>
                        }
                        <button onClick={() => {
                            setMobileSearchDropdown(false)
                            handleSearch()
                        }} className='search-button'>search</button>
                    </div>
                }
        </>
    )
}

