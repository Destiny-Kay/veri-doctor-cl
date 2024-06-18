import './index.css'


export function ServiceCard(props){
    return(
        <div className='service-card'>
            <img src={props.imagesrc}></img>
            <p>{props.name}</p>
        </div>
    )
}