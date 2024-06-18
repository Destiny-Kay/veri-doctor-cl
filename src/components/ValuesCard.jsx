import './ValuesCard.css'


export function ValuesCard(props) {
    return (
        <div className="values-cont">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
        </div>
    )
}