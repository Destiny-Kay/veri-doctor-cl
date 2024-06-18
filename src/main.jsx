import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
// import { AppLayout } from './layouts/AppLayout'
import { Home  } from './pages/Home'
import { Login } from './pages/Login'
import { Doctors } from './pages/Doctors'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Error } from './pages/Error'
import { Tos } from './pages/Tos'
// import { Services } from './pages/Services'
import { Signup } from './pages/Signup'
import { DocSignup } from './pages/DocSignup'
import './index.css'
import { BookDoc } from './pages/BookDoc'
import { ResetPass } from './pages/ResetPass'
import { UserProvider } from './context/UserContext'
import { SearchProvider } from './context/SearchContext'
import { MainLayout } from './layouts/MainLayout'
import { UserAppLayout } from './layouts/UserAppLayout'
import { DoctorPP } from './pages/DoctorPP'


// USER APP
const DashboardUsr = lazy(() => import("./pages/usr/DashboardUsr").then(module => {
  return { default: module.DashboardUsr}
}))

const ProfileUsr = lazy(() => import("./pages/usr/Profile").then(module => {
  return { default: module.ProfileUsr}
}))

const DoctorsUsr = lazy(() => import("./pages/usr/Doctors").then(module => {
  return { default: module.DoctorsUsr}
}))

const AppointmentUsr = lazy(() => import("./pages/usr/AppointmentUsr").then(module => {
  return { default: module.AppointmentUsr}
}))

const Records = lazy(() => import("./pages/usr/Records").then(module => {
  return { default: module.Records}
}))

// const Community = lazy(() => import("./pages/usr/Community").then(module => {
//   return { default: module.Community}
// }))

// const Pharmacy = lazy(() => import("./pages/usr/Pharmacy").then(module => {
//   return { default: module.Pharmacy}
// }))

// DOCTORS APP
const Schedule = lazy(() => import("./pages/Schedule").then(module => {
  return { default: module.Schedule}
}))

const Dashboard = lazy(() => import("./pages/Dashboard").then(module => {
  return { default: module.Dashboard}
}))

const Profile = lazy(() => import("./pages/Profile").then(module => {
  return { default: module.Profile}
}))

const Appointments = lazy(() => import("./pages/Appointment").then(module => {
  return { default: module.Appointments}
}))

// const DoctorsPP = lazy(() => import("./pages/DoctorPP").then(module => {
//   return { default: module.DctorPP}
// }))

// COMMON PAGES
// const Signup = lazy(() => import("./pages/Signup").then(module => {
//   return { default: module.Signup}
// }))



const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />
  },
  {
    path: '/doctors',
    element: <Doctors />
  },
  // {
  //   path: '/services',
  //   element: <Services />
  // },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/auth',
    children: [
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path:'doc-signup',
        element: <DocSignup />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'reset-password',
        element: <ResetPass />
      }
    ]
  },
  {
    path: '/book-doc/:doc_id',
    element: <BookDoc />
  },
  {
    path: '/doc',
    // element: <AppPage />,
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'appointments',
        element: <Appointments />
      },
      {
        path: 'schedule',
        element: <Schedule />
      }
    ]
  },
  {
    path: '/usr',
    element: <UserAppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardUsr />
      },
      {
        path: 'profile',
        element: <ProfileUsr />
      },
      {
        path: 'doctors',
        element: <DoctorsUsr />
      },
      {
        path:'appointments',
        element: <AppointmentUsr />
      },
      // {
      //   path: 'community',
      //   element: <Community />
      // },
      // {
      //   path: 'pharmacy',
      //   element: <Pharmacy />
      // },
      {
        path:'records',
        element: <Records/>
      },
    ]
  },
  {
    path: '/policies/tos',
    element: <Tos />
  },
  {
    path: '/policies/doctorspp',
    element: <DoctorPP />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <SearchProvider>
        <Provider store={store}>
          {/* <Suspense fallback={<p>Loading...</p>}> */}
            <RouterProvider router={router} />
          {/* </Suspense> */}
        </Provider>
      </SearchProvider>
    </UserProvider>
  </React.StrictMode>,
)
