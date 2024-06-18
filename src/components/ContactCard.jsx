import './index.css'

export function ContactCard(props){
    return(
        <div className="contact-card">
            {props.children}
        </div>
    )
}