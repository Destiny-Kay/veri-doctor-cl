import './index.css'


export function ImageCard({image, tag}) {
    return (
        <div className='image-card'>
            <img src={image} width={50} height={20} alt='services'></img>
            <h2>{tag}</h2>
        </div>
    )
}