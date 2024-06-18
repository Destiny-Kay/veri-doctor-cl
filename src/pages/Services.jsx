import { AppLayout } from "../layouts/AppLayout";
import './index.css'
import '/gyn.jpg'
import { ServiceCard } from "../components/ServiceCard";
import telemedIcon from '../assets/telemedicine.svg'
import recordIcon from '../assets/record_manage.svg'
import reserveIcon from '../assets/reserve.svg'
import pharmacyIcon from '../assets/pharmacy.svg'

export function Services(props){
    return (
    <AppLayout>
        <div className="service-container">
            <h1 className="blue-heading">
                Our services
            </h1>
            <div className="service-cont">
                <ServiceCard imagesrc={telemedIcon} name='Telemedicine'/>
                <ServiceCard imagesrc={recordIcon} name='Healthcare record management'/>
                <ServiceCard imagesrc={reserveIcon} name='Booking and appointment scheduling'/>
                <ServiceCard imagesrc={pharmacyIcon} name='Purchase of medicine from trusted pharmacies'/>
            </div>
        </div>
    </AppLayout>
    )
}