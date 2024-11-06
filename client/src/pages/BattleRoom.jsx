import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import bgBattle from "../assets/bg-battle.png";

const socket = io("http://localhost:3000");

export default function BattleRoom() {
    const location = useLocation();
    const { card } = location.state || {};
    const [userPoints, setUserPoints] = useState(0);
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [message, setMessage] = useState('');
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

        socket.on("startGame", () => {
            setIsGameStarted(true);
            setMessage("The game has started! Make your move.");
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
    }, [card]);

    const handleRPSChoice = (userChoice) => {
        if (isGameStarted && !isGameOver) {
            socket.emit("makeChoice", { userChoice, username: card.name });
        }
    };

    const battleRoomStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        backgroundImage: url(${bgBattle}),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        color: 'white',
        overflow: 'hidden',
    };

    return (
        <div style={battleRoomStyle}>
            <h2 className="text-2xl font-bold">Battle Room</h2>
            {card && (
                <div className="card-info">
                    <img src={card.images?.small} alt={card.name} />
                    <h3>{card.name}</h3>
                </div>
            )}
            <div className="score-status">
                <p>Your Points: {userPoints}</p>
                <p>Opponent Points: {opponentPoints}</p>
            </div>
            <div className="actions">
                {choices.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => handleRPSChoice(choice)}
                        className="rps-button text-black"
                        disabled={!isGameStarted || isGameOver}
                    >
                        {choice.charAt(0).toUpperCase() + choice.slice(1)}
                    </button>
                ))}
            </div>
            {message && <p className="message">{message}</p>}
            {isGameOver && (
                <p className="result">
                    {userPoints >= 10 ? "You win the game!" : "You lose the game!"}
                </p>
            )}
        </div>
    );
}