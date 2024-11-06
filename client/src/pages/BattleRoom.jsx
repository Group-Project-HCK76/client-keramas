import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import bgBattle from "../assets/bg-battle.png"

export default function BattleRoom() {
    const location = useLocation();
    const { card } = location.state || {}; // Get the passed card data
    const [userHealth, setUserHealth] = useState(100);
    const [opponentHealth, setOpponentHealth] = useState(100);
    const [message, setMessage] = useState('');

    const handleAttack = () => {
        const damage = Math.floor(Math.random() * 20) + 1; // Random damage between 1 and 20
        setOpponentHealth((prev) => Math.max(prev - damage, 0)); // Reduce opponent's health
        setMessage(`You dealt ${damage} damage to ${card.name}!`);
    };

    const handleHeal = () => {
        const heal = Math.floor(Math.random() * 15) + 1; // Random heal between 1 and 15
        setUserHealth((prev) => Math.min(prev + heal, 100)); // Heal the user
        setMessage(`You healed for ${heal} health!`);
    };

    // Inline style for the background
    const battleRoomStyle = {
        display: 'flex', // Use flexbox for centering
        flexDirection: 'column', // Arrange items vertically
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center', // Center items vertically
        textAlign: 'center',
        padding: '20px',
        backgroundImage: `url(${bgBattle})`, // Background image path
        backgroundSize: 'cover', // Cover the entire area
        backgroundPosition: 'center', // Center the image
        width: '100vw', // Full viewport width
        height: '100vh', // Full viewport height
        color: 'white', // Text color
        overflow: 'hidden', // Prevent overflow
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
            <div className="health-status">
                <p>Your Health: {userHealth}</p>
                <p>Opponent Health: {opponentHealth}</p>
            </div>
            <div className="actions">
                <button onClick={handleAttack} className="attack-button">
                    Attack
                </button>
                <button onClick={handleHeal} className="heal-button">
                    Heal
                </button>
            </div>
            {message && <p className="message">{message}</p>}
            {opponentHealth <= 0 && <p className="result">You win!</p>}
        </div>
    );
}