import { ContactCard } from "./ContactCard";
import clockIcon from '../assets/clock.svg'
import './index.css'

export function AboutCard({title, description}) {
    return (
        <ContactCard>
            <div className="about-card">
                <img src={clockIcon}></img>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </ContactCard>
    )
}

