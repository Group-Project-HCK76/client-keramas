import { createBrowserRouter, redirect } from 'react-router-dom';
import Welcome from './pages/Welcome';
import GetCard from './pages/GetCard';
import BattleRoom from './pages/BattleRoom';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Welcome />,
    },
    {
        path: "/pickCard",
        element: <GetCard />,
    },
    {
        path: "/battle-room",
        element: <BattleRoom />

    }
])

export default router