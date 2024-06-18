import { AppLayout } from "../layouts/AppLayout"
import '/pill.svg'
import '/doctor_img.png'
import '/doctor_steth.svg'
import '/doctor_hero.svg'
import '/gyn.jpg'
import '/telemed.jpg'
import '/appointment_doc.jpg'
import medicalFolder from '../assets/ph_folders.svg'
import handClick from '../assets/tabler_hand-click.svg'
import callSchedule from '../assets/uil_schedule.svg'
import clock from '../assets/clock.svg'
import efficient from '../assets/efficient.svg'
import healthy from '../assets/healthy.svg'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Card } from "../components/Card"
import { InfoCard } from "../components/InfoCard"
import { ImageCard } from "../components/ImageCard"
import './index.css'
import { MainButton } from "../components/MainButton"


export function Home() {
    return (
        <AppLayout>
            <div className="auto-cont">
                <div className="hero-container">
                    <div className="hero-text">
                        <h1>Access quality healthcare anywhere, anytime!!!</h1>
                        <p>Book and schedule appointments with top specialists, manage your health records securely, and access healthcare at your convenience. Veri Doctor simplifies healthcare, empowering you to take control of your health journey seamlessly.</p>
                        <MainButton name='book now' size='medium' link='/doctors' variant='filled'/>
                    </div>
                    <div className="hero-image">
                        <img src="doctor_hero.svg" width={50} height={500} alt="hero-image"></img>
                    </div>
                </div>


                <div className="div-abt">
                    <h2 className="blue-heading">Welcome to veri doctor - where your health matters most</h2>
                    <div>
                        <Card img_src={handClick} title={'Book and schedule appointments'}/>
                        <Card img_src={callSchedule} title={'Telehealth consultations'} />
                        <Card img_src={medicalFolder} title={'Manage healthcare records'}/>
                    </div>
                </div>

                <h2 className="blue-heading">Countless health services at your fingertips</h2>
                <div className="service-cards">
                    <ImageCard image='gyn.jpg' tag='Gynaecologists'/>
                    <ImageCard image='telemed.jpg' tag='Dermatologists'/>
                    <ImageCard image='appointment_doc.jpg' tag='Dentists'/>
                </div>
                <div className="center">
                    <MainButton name='discover more' variant='filled' size='medium' link='/doctors'/>
                </div>
                <div>
                    <div className="info_section">
                        <img src="doctor_steth.svg" width={450} alt="doctor_image"></img>
                        <div>
                            <h2 className="blue-heading">Getting a healthcare provider has never been this easy</h2>
                            <Accordion>
                                <AccordionSummary
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    Find a healthcare service provider
                                </AccordionSummary>
                                <AccordionDetails>
                                    Leveraging our platform, search for an available appointment slot
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary>
                                    Schedule an appointment
                                </AccordionSummary>
                                <AccordionDetails>
                                    Schedule a time and date that fits your schedule and is convenient.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary>
                                    Access your medical records
                                </AccordionSummary>
                                <AccordionDetails>
                                    Through the platform you can access your vitals and medical records from  doctors.
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                    <div className="flex">
                        <InfoCard icon={clock} title='Experience Convenience' description='Schedule for appointments from anywhere'/>
                        <InfoCard icon={efficient} title='Save time' description='No more long queues at a healthcare facility.'/>
                        <InfoCard icon={healthy} title='Stay healthy' description='Keep yourself in check by tracking your health condition.'/>
                    </div>
                    <h1 className="outro">Let&apos;s create a healthier community together.</h1>
                </div>
            </div>
        </AppLayout>
    )
}
