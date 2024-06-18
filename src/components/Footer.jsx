import xIcon from '../assets/x.svg'
import facebookIcon from '../assets/facebook.svg'
import instagramIcon from '../assets/instagram.svg'
import whatsappIcon from '../assets/whatsapp.svg'
import linkedIcIcon from '../assets/linkedin.svg'
import './index.css'
import { Link } from "react-router-dom"


export function Footer(props){
    return(
        <footer>
            <div className='footer-links'>
                <div className='socials'>
                    <h2>VERI DOCTOR</h2>
                    <div>
                    <Link to='https://twitter.com/Veri_doctor' aria-label='Go to our twitter page'>
                        <img src={xIcon} alt='icon'></img>
                    </Link>
                    <Link to='https://www.facebook.com/people/Veri-Doctor/100066543586030/' aria-label='Go to our facebook page'>
                        <img src={facebookIcon} alt='icon'></img>
                    </Link>
                    <Link to='https://www.linkedin.com/company/veridoctor-ke/' aria-label='Go to our linkedin page'>
                        <img src={linkedIcIcon} alt='icon'></img>
                    </Link>
                    <Link  to='https://wa.me/+254705590527' aria-label='Chat us on whatsapp'>
                        <img src={whatsappIcon} alt='icon'></img>
                    </Link>
                    <Link to='https://www.instagram.com/veri_doctor/' aria-label='Go to our instagram page'>
                        <img src={instagramIcon} alt='icon'></img>
                    </Link>
                    </div>
                    <Link to='mailto:info@veridoctor.com'><p>info@veridoctor.com</p></Link>
                </div>
                <div>
                    <h2>Platform</h2>
                    <p>Book a consultation</p>
                    <p><Link to='/doctors' aria-label='Go to doctors page'>Doctors</Link></p>
                    <p><Link to='/about' aria-label='Go to about page'>About</Link></p>
                    <p><Link to='/auth/doc-signup' aria-label='Signup as a healthcare professional'>Are you a doctor?</Link></p>
                </div>
                <div>
                    <h2>Help</h2>
                    <p>FAQ</p>
                    <p><Link to='/contact'>contact</Link></p>
                </div>
                <div>
                    <h2>Legal</h2>
                    <p><Link to='/policies/tos' aria-label='View our cookie policy'>Cookie & privacy policy</Link></p>
                    <p><Link to='/policies/tos' aria-label='View our terms and conditions'>Terms & conditions</Link></p>
                </div>
            </div>
            <p className='copyright'>&copy;{new Date().getFullYear()} veridoctor. All rights reserved</p>
        </footer>
    )
}