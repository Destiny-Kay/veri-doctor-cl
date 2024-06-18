import { Link } from 'react-router-dom'
import './index.css'


export function MainButton({name, size, variant, link, target}){
    return (
        <button className={`btn ${size} ${variant}`}>
            <Link to={link} target={target ? target : ''}>
                {name}
            </Link>
        </button>
    )
}