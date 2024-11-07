import bg from "../assets/bg-gif.gif";
import logo from "../assets/Battle card.png";
import 'animate.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Swal from "sweetalert2";

export default function Jumbotron() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!username.trim()) {
            Swal.fire({
                title: 'Error!',
                text: 'Username cannot be empty!',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
            return;
        }

        localStorage.setItem('username', username);
        socket.emit("joinGame", username);
    }

    useEffect(() => {
        const welcomingUserHandler = (result) => {
            Swal.fire({
                title: 'Welcome!',
                text: result.message,
                icon: 'success',
                confirmButtonText: 'Play!',
            }).then(() => {
                navigate("/pickCard");
            });
        };

        socket.on("welcomingUser", welcomingUserHandler);

        return () => {
            socket.off("welcomingUser", welcomingUserHandler);
        };
    }, [navigate]);

    return (
        <section
            className="bg-center bg-no-repeat h-screen w-screen bg-gray-700 bg-blend-multiply"
            style={{ backgroundImage: `url(${bg})` }}>
            <div className="px-4 mx-auto max-w-screen-xl text-center">
                <div className="flex flex-col items-center justify-center h-screen">
                    <img src={logo} alt="logo" className="animate__animated animate__zoomIn" />
                    
                    {/* Username Input Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="bg-transparent border-b-4 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Insert your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit"
                            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                        >
                            Let's Battle
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
