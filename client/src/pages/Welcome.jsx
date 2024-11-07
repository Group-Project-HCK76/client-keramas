import { Outlet } from "react-router-dom";
import Jumbotron from "../component/Jumbotron";

export default function Welcome() {
    return (
        <>
            <Outlet />
            <Jumbotron />
        </>
    )
}