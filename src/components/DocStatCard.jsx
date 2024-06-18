import './DocStatCard.css'

export function DocStatCard(props) {
    return (
        <div className='doc-stat-card'>
            <img src={props.image}></img>
            <p>{props.title}</p>
            <p className='stat-count'>{props.stat}</p>
        </div>
    )
}