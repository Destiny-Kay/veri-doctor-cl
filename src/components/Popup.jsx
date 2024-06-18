
export const Popup = ({isOpen, onClose}) => {
    if (!isOpen) return null
    return (
        <div className='popup'>
            <p>
                Please confirm booking of Dr. {docInfo.first_name} {docInfo.last_name} 
                on {dateValue} between {timeslotData}
            </p>
            <button>Confirm</button>
            <button>Cancel</button>
        </div>
    )
}