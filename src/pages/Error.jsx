import { Link, useRouteError } from 'react-router-dom'
import './index.css'

export function Error(props) {
    const error = useRouteError()
    return(
        <div className='error-page'>
            <h1>{error.code}</h1>
            <h1>Something is broken</h1>
            <h2>{error.statusText}</h2>
            <Link to='/'><h1 className='blue-heading'>Go back</h1></Link>
        </div>
    )
}