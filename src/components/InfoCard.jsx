import './index.css'


export function InfoCard({icon, title, description}) {
    return(
        <div className='info-card'>
            <img src={icon} alt='icons' width={70} height={70}></img>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    )
}
