import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import './AppLayout.css'
import { Toaster } from "sonner"


export function AppLayout(props) {
    return (
        <>
        <Toaster richColors position="top-center" expand={false}/>
        <Navbar />
            <div className="main">
                {props.children}
            </div>
        <Footer />
        </>
    )
}
