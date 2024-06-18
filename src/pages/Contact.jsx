import { AppLayout } from "../layouts/AppLayout";
import { ContactCard } from "../components/ContactCard";
import '/logo.svg'
import instagramIcon from '../assets/instagram.svg'
import emailIcon from '../assets/email.svg'
import locationPin from '../assets/location_black.svg'
import likeIcon from '../assets/like.svg'
import linkedInIcon from '../assets/linkedin.svg'
import xIcon from '../assets/x.svg'
import facebookIcon from '../assets/facebook.svg'
import WhatsappIcon from '../assets/whatsapp.svg'
import './index.css'
import { Link } from "react-router-dom";

export function Contact(props) {
    return(
        <AppLayout>
            <div className="auto-cont">

                <h1 className="blue-heading">GET IN TOUCH WITH US</h1>
                <div className="contact-section">
                    <ContactCard>
                        <img src={locationPin}></img>
                        <h2>VISIT OUR OFFICES</h2>
                        <p>Westlands Nairobi, Mpaka road</p>
                    </ContactCard>
                    <ContactCard>
                        <img src={emailIcon}></img>
                        <h2>EMAIL US</h2>
                        <p>info@veridoctor.com</p>
                    </ContactCard>
                    <ContactCard>
                        <img src={likeIcon}></img>
                        <h2>SOCIAL MEDIA</h2>
                        <div className="social-links">
                            <Link to='https://twitter.com/Veri_doctor'> <img src={xIcon}></img> </Link>
                            <Link to='https://www.facebook.com/people/Veri-Doctor/100066543586030/'><img src={facebookIcon}></img></Link>
                            <Link to='https://www.linkedin.com/company/veridoctor-ke/'><img src={linkedInIcon}></img></Link>
                            <Link to='https://wa.me/+254705590527'><img src={WhatsappIcon}></img></Link>
                            <Link to='https://www.instagram.com/veri_doctor/'><img src={instagramIcon}></img></Link>
                        </div>
                    </ContactCard>
                </div>
            </div>
        </AppLayout>
    )
}
