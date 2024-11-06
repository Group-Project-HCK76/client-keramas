import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import bgBattle from "../assets/bg-battle.png";
import Swal from 'sweetalert2';

const socket = io("http://localhost:3000");

export default function BattleRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const { card } = location.state || {};
    const [userPoints, setUserPoints] = useState(0);
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [message, setMessage] = useState('');
    const [userChoice, setUserChoice] = useState('');
    const [opponentChoice, setOpponentChoice] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const choices = ["rock", "paper", "scissors"];

    useEffect(() => {
        if (card) {
            socket.emit("joinGame", card.name);
        }

        socket.on("welcomingUser", (data) => {
            setMessage(data.message);
        });

        socket.on("StartTheGame", (data) => {
            let countdown = 3;
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
                        willClose: () => clearInterval(countdownInterval),
                    });
                    countdown--;
                }
            }, 1000);
        });

        socket.on("gameResult", (data) => {
            const user = data.users.find((u) => u.username === card.name);
            const opponent = data.users.find((u) => u.username !== card.name);

            setUserPoints(user?.points || 0);
            setOpponentPoints(opponent?.points || 0);
            setMessage(data.message);

            if (user.points >= 10 || opponent.points >= 10) {
                setIsGameOver(true);
                setIsGameStarted(false);
            }
        });

        socket.on("gameOver", (data) => {
            setMessage(data.message);
            setIsGameOver(true);
            setIsGameStarted(false);
        });

        socket.on("resetGame", (data) => {
            setUserPoints(0);
            setOpponentPoints(0);
            setMessage(data.message);
            setIsGameStarted(false);
            setIsGameOver(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [card, navigate]);

    const handleRandomChoice = () => {
        if (isGameStarted && !isGameOver) {
            const randomUserChoice = choices[Math.floor(Math.random() * choices.length)];
            const randomOpponentChoice = choices[Math.floor(Math.random() * choices.length)];

            setUserChoice(randomUserChoice);
            setOpponentChoice(randomOpponentChoice);

            let roundResult;
            if (randomUserChoice === randomOpponentChoice) {
                roundResult = "It's a draw!";
            } else if (
                (randomUserChoice === "rock" && randomOpponentChoice === "scissors") ||
                (randomUserChoice === "paper" && randomOpponentChoice === "rock") ||
                (randomUserChoice === "scissors" && randomOpponentChoice === "paper")
            ) {
                setUserPoints((prev) => prev + 1);
                roundResult = "You win this round!";
            } else {
                setOpponentPoints((prev) => prev + 1);
                roundResult = "Opponent wins this round!";
            }

            setMessage(roundResult);
            socket.emit("makeChoice", { userChoice: randomUserChoice, username: card.name });
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
        <div style={battleRoomStyle}>
            <h2 className="text-2xl text-black font-bold">Battle Room</h2>
            {card && (
                <div className="card-info text-black">
                    <img src={card.images?.small} alt={card.name} />
                    <h3>{card.name}</h3>
                </div>
            )}
            <div className="score-status text-black">
                <p>Your Points: {userPoints}</p>
                <p>Opponent Points: {opponentPoints}</p>
            </div>
            <div className="actions">
                {!isGameStarted && (
                    <button
                        onClick={() => socket.emit("startGame", card.name)}
                        className="rps-button"
                    >
                        Start The Game
                    </button>
                )}
                <button
                    onClick={handleRandomChoice}
                    className="rps-button"
                >
                    Make Move
                </button>
            </div>
            <p className="text-black">Your Choice: {userChoice}</p>
            <p className="text-black">Opponent's Choice: {opponentChoice}</p>
            {message && <p className="message text-black">{message}</p>}
            {isGameOver && (
                <p className="result text-black">
                    {userPoints >= 10 ? "You win the game!" : "You lose the game!"}
                </p>
            )}
        </div>
    );
}