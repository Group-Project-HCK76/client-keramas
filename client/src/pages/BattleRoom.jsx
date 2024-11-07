import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../socket';
import Swal from 'sweetalert2';
import bgBattle from "../assets/bg-battle.png";

export default function BattleRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const { card } = location.state || {};

    const [userPoints, setUserPoints] = useState(0);
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [message, setMessage] = useState('');
    const [userChoice, setUserChoice] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const choices = ["rock", "paper", "scissors"];

    useEffect(() => {
        if (card) {
            socket.connect(); 
            socket.emit("joinGame", card.name);
        }

        socket.on("waiting", () => {
            Swal.fire({
                title: "Waiting for opponent...",
                allowOutsideClick: false,
                showConfirmButton: false,
            });
        });

        socket.on("welcomingUser", (data) => {
            setMessage(data.message);
        });

        socket.on("startGame", () => {
            Swal.close();
            let countdown = 3;
            setIsGameStarted(false);

            const countdownInterval = setInterval(() => {
                if (countdown === 0) {
                    clearInterval(countdownInterval);
                    Swal.close();
                    setIsGameStarted(true);
                    setMessage("The game has started! Make your move.");
                } else {
                    Swal.fire({
                        title: `Game starting in ${countdown}`,
                        text: "Get ready!",
                        timer: 1000,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                    });
                    countdown--;
                }
            }, 1000);
        });

        socket.on("gameResult", (data) => {
            Swal.close();
            const user = data.users.find((u) => u.username === card.name);
            const opponent = data.users.find((u) => u.username !== card.name);

            setUserPoints(user?.points || 0);
            setOpponentPoints(opponent?.points || 0);
            setMessage(data.message);

            Swal.fire({
                title: data.message,
                text: `Score: You ${user.points} - Opponent ${opponent.points}`,
                timer: 2500,
                showConfirmButton: false,
            });
        });

        socket.on("gameOver", (data) => {
            setMessage(data.message);
            setIsGameOver(true);
            setIsGameStarted(false);

            Swal.fire({
                title: data.message,
                icon: "info",
                confirmButtonText: "OK",
            }).then(() => {
                socket.disconnect();  
                navigate("/");  // welcome page
            });
        });

        socket.on("resetGame", (data) => {
            setUserPoints(0);
            setOpponentPoints(0);
            setMessage(data.message);
            setIsGameStarted(false);
            setIsGameOver(false);
            Swal.fire({
                title: "Game Reset!",
                text: "Get ready for a new game!",
                timer: 1700,
                showConfirmButton: false,
            });
        });

        return () => {
            socket.disconnect();
            socket.off("waiting");
            socket.off("welcomingUser");
            socket.off("startGame");
            socket.off("gameResult");
            socket.off("gameOver");
            socket.off("resetGame");
        };
    }, [card]);

    const handleRPSChoice = (userChoice) => {
        if (isGameStarted && !isGameOver) {
            setUserChoice(userChoice);
            socket.emit("makeChoice", { userChoice, username: card.name });

            Swal.fire({
                title: "Waiting for opponent's choice...",
                allowOutsideClick: false,
                showConfirmButton: false,
            });
        }
    };

    const battleRoomStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        backgroundImage: `url(${bgBattle})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        color: 'white',
        overflow: 'hidden',
    };

    return (
        <div style={battleRoomStyle} className="bg-center bg-no-repeat h-screen w-screen bg-gray-700 bg-blend-multiply">
            <div className="bg-white rounded p-8 max-w-md mx-auto text-center">
                <h2 className="text-2xl text-black font-bold mb-4">Battle Room</h2>
                {card && (
                    <div className="card-info text-black mb-4">
                        <img src={card.images?.small} alt={card.name} className="mx-auto" />
                        <h3 className="text-xl font-semibold mt-2">{card.name}</h3>
                    </div>
                )}
                <div className="score-status text-black mb-4 font-semibold">
                    <p>Your Points: {userPoints}</p>
                    <p>Opponent Points: {opponentPoints}</p>
                </div>
                {isGameStarted ? (
                    <div className="actions flex justify-center gap-4 mb-4">
                        {choices.map((choice) => (
                            <button
                                key={choice}
                                onClick={() => handleRPSChoice(choice)}
                                className="rps-button text-white px-4 py-2 bg-black rounded"
                            >
                                {choice.charAt(0).toUpperCase() + choice.slice(1)}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-black mb-4">Waiting for opponent to join...</p>
                )}
                <p className="text-black mb-4">Your Choice: {userChoice}</p>
                {message && <p className="message text-black mb-4">{message}</p>}
                {isGameOver && (
                    <p className="result text-black font-bold">
                        {userPoints >= 10 ? "You win the game!" : "You lose the game!"}
                    </p>
                )}
            </div>
        </div>

    );
}
