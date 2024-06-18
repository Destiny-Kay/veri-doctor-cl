import './index.css'


export function Card({img_src, title}){
    return(
        <div className='stat-card'>
            <img src={img_src} width={100} height={100} alt='icon'></img>
            <p>{title}</p>
        </div>
    )
}