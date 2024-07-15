import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'

import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Pribadi from './pages/Pribadi';
import Prodi from './pages/Prodi';
import Orangtua from './pages/Orangtua';
import Berkas from './pages/Berkas';
import Underconstruction from './pages/errors/Underconstruction';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register/>,
  },{
    path: "/login",
    element: <Login/>,
  },{
    path: "/dashboard",
    element: <Dashboard/>,
  },{
    path: "/pribadi",
    element: <Pribadi/>,
  },{
    path: "/orangtua",
    element: <Orangtua/>,
  },{
    path: "/programstudi",
    element: <Prodi/>,
  },{
    path: "/berkas",
    element: <Berkas/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
