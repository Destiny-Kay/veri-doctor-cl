import './index.css'
import { Link } from 'react-router-dom'

export function SideMenu(props){
    return(
        <div className='side-menu'>
            <Link>menu-item 1</Link>
            <Link>menu-item 2</Link>
            <Link>menu-item 3</Link>
            <Link>menu-item 4</Link>
            <Link>menu-item 5</Link>
            <Link>menu-item 6</Link>
            <Link>menu-item 7</Link>
        </div>
    )
}