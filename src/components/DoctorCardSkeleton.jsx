import './index.css'
export function DoctorCardSkeleton(){

    return(
        <div className="doc-card-skeleton">
            <div className="skeleton-main-sect">
                <div className='skeleton-image loading-pulse'></div>
                <div className='skeleton-text-content'>
                    <div className='loading-pulse'></div>
                    <div className='loading-pulse'></div>
                    <div className='loading-pulse'></div>
                    <div className='loading-pulse'></div>
                    <div className='loading-pulse'></div>
                </div>
            </div>
            <div className='skeleton-button loading-pulse'></div>
        </div>
    )
}
