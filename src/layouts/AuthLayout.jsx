import { Toaster } from 'sonner'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

export function AuthLayout(props) {
    return (
        <>
        <Toaster richColors position="top-center" expand={false}/>
        <div className="main">
                    <Outlet />
        </div>
        </>
    )
}