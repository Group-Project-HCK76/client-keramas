import { createBrowserRouter, redirect } from 'react-router-dom';
import Welcome from './pages/Welcome';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Welcome />,
    },
])

export default router