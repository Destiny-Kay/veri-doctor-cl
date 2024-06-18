import { AppLayout } from '../layouts/AppLayout'
import { ServiceCard } from "../components/ServiceCard";
import telemedIcon from '../assets/telemedicine.svg'
import recordIcon from '../assets/record_manage.svg'
import reserveIcon from '../assets/reserve.svg'
import './index.css'
import '/doctor-image.svg'
import '/goal.png'
import '/pharmacy.png'
import '/health_records.png'
import '/telemed_illust.png'
import { ValuesCard } from '../components/ValuesCard';

export function About() {
    return(
        <AppLayout>
            <div className="about-cont">
                <div>

                </div>
                <h2 className='blue-heading'>About us</h2>
                <div className='main-about'>
                    <img src='doctor-image.svg'></img>
                    <div>
                    <p>
                    At veridoctor, we prioritize your well-being. We recognize the challenges that often accompany seeking medical care. 
                    That&apos;s why we&apos;re dedicated to empowering individuals like you to take charge of your health journey.</p>
                    
                    <p>Our platform offers a seamless experience, allowing you to effortlessly book and schedule appointments with highly 
                    qualified specialists at your convenience. No more waiting on hold or struggling to find an available time slot. With veridoctor, 
                    you&apos;re in control.</p>
                    </div>
                </div>
                <div className='main-about'>
                    <img src='telemed_illust.png'></img>
                    <p>
                    But our commitment doesn&apos;t stop there. We understand the importance of accessible healthcare, which is why we offer a robust telemedicine solution.
                     Consult with healthcare professionals from the comfort of your own home, reducing the need for travel and ensuring you receive timely medical advice when you need it most.
                    </p>
                </div>
                <div className="main-about">
                    <img src='health_records.png'></img>
                    <p>
                    And because we believe that your health information should be easily accessible and securely managed, 
                    we provide you with the tools to manage your health records on the go. Your medical history, prescriptions, 
                    and appointments are all conveniently stored and accessible whenever you need them.
                    </p>
                </div>
                <h1 className="blue-heading">
                Our services
                </h1>
                <div className="service-cont">
                    <ServiceCard imagesrc={reserveIcon} name='Booking and appointment scheduling'/>
                    <ServiceCard imagesrc={telemedIcon} name='Telehealth'/>
                    <ServiceCard imagesrc={recordIcon} name='Healthcare record management'/>
                </div>
                <p>At veridoctor, your health is our priority. Join us today and experience healthcare that&apos;s tailored to your needs, empowering you to live your healthiest life.</p>
                <h2 className='blue-heading'>Discover why choosing us matters</h2>
                <div className='grid-about'>
                    <p>We pride ourselves on our unwavering commitment to <b>CARE</b></p>
                    <div className='values-container'>
                        <ValuesCard title='Convenience' description='Striving to prioritize your well-being, Veri doctor aims to make taking care of your health a stress-free experience.'/>
                        <ValuesCard title='Accessibility' description='At the heart of our service provision lies accessibility, ensuring a seamless and inclusive experience for everyone.'/>
                        <ValuesCard title='Reliability' description='Veri doctor is built on a foundation of reliability, providing you with consistent, dependable services you can trust.'/>
                        <ValuesCard title='Excellence' description='Delivering exceptional services is our unwavering commitment, ensuring you receive the highest quality medical services available.'/>
                    </div>
                    <p>We stand as a beacon of reliability in healthcare, offering unparalleled convenience and 
                        accessibility to our valued clients. With a steadfast dedication to excellence, we provide 
                        services that set the standard in the industry. Choose Veri Doctor for a healthcare experience 
                        that prioritizes your needs and exceeds your expectations.
                    </p>
                </div>
            </div>
        </AppLayout>
    )
}
