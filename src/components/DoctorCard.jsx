import '/appointment_doc.jpg'
import stethIcon from '../assets/doctor_steth.svg'
import locationPin from '../assets/location-pin.svg'
import moneyIcon from '../assets/money.svg'
import hospitalIcon from '../assets/hospital.svg'
import { MainButton } from './MainButton'
import './index.css'


export function DoctorCard(props){

    return(
        <div className="doctor-card">
            <div className="doctor-info">
                <img src={props.doc_image} alt="doctor-image" height={80} width={80} className='doctor-image'></img>
                <div>
                    <h2>{props.title} {props.first_name} {props.last_name}</h2>
                    <div className='icon-label'>
                        <img  src={stethIcon} alt="icon"></img>
                        <p><b>{props.specialty} </b>specializes in {props.sub_specialty}</p>
                    </div>
                    <div className="icon-label">
                        <img  src={locationPin} alt="icon"></img>
                        {
                            props.healthcare_facility.location ?
                            <p>{props.healthcare_facility.location.name}</p>
                            :
                            <p>--</p>
                        }
                    </div>
                    <div className="icon-label">
                        <img src={hospitalIcon} alt="icon"></img>
                        {
                            props.healthcare_facility ?
                                <p>{props.healthcare_facility.name}</p>
                                :<p>--</p>
                        }   

                    </div>
                    <div className="icon-label">
                        <img src={moneyIcon} alt="icon"></img>
                        {
                            props.consultation_fee ?
                            <p>Kshs. {props.consultation_fee}</p>
                            :
                            <p>Kshs. --</p>
                        }
                    </div>
                </div>
            </div>

            <MainButton variant="filled" size="medium" name="book now" link={`/book-doc/${props.doc_id}`}/>
        </div>
    )
}
