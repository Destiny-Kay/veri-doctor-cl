import { Sidebar } from "../components/Sidebar";
import './MainLayout.css'
import { Toaster } from 'sonner'
import { UserProvider, useUser } from "../context/UserContext";
import { Link, Outlet } from "react-router-dom";
import { Suspense } from "react";
import MoonLoader from "react-spinners/MoonLoader";



export function MainLayout() {
    const {userData } = useUser()

    return(
        <UserProvider>
            {
                userData === "doctor" ?
                <div className="app-flex">
                    <Toaster richColors position="top-center" expand={false}/>
                    <Sidebar />
                    <div className="main-component">
                        <Suspense fallback={
                                    <div className="loader-div">
                                        <MoonLoader
                                            color="#52c480"
                                            cssOverride={{}}
                                            speedMultiplier={1}
                                         />
                                    </div>}>
                            <Outlet />
                        </Suspense>
                    </div>
                </div>
                :
                <div className="error-page">
                    <h1 className="blue-heading">You are not logged in</h1>
                    <Link to={'/auth/login'}>Go to login</Link>
                </div>
            }
        </UserProvider>
    )
}
