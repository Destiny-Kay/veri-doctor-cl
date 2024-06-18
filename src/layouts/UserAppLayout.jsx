import { UserProvider, useUser } from "../context/UserContext"
import { Toaster } from "sonner"
import { SidebarUser } from "../components/SidebarUser"
import { Link, Outlet } from "react-router-dom"
import { Suspense } from "react"
import MoonLoader from 'react-spinners/MoonLoader'

export function UserAppLayout() {
    const {userData} = useUser()
    return (
        <UserProvider>
            {
                userData === "regular" ?
                <div className="app-flex">
                    <Toaster richColors position="top-center" expand={false}/>
                    <SidebarUser />
                    <div className="main-component">
                        <Suspense fallback={
                                        <div className="loader-div">
                                            <MoonLoader
                                                color="#52c480"
                                                cssOverride={{}}
                                                speedMultiplier={1}
                                            />
                                        </div>
                                        }>
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