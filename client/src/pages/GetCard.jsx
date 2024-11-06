import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function GetCard() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('https://api.pokemontcg.io/v2/cards');
                setCards(response.data.data); // assuming response.data.data contains the card array
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching cards: {error.message}</p>;
    }

    return (
        <section>
            <div className="w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                        Pokémon Card Collection
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                        Explore our collection of Pokémon cards!
                    </p>
                </header>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {cards.slice(0, 10).map((card) => (
                        <li key={card.id}>
                            <Link 
                                to="/battle-room" 
                                state={{ card }} // Pass the selected card to BattleRoom
                                className="group block overflow-hidden"
                            >
                                <img
                                    src={card.images?.small} // Adjust the image source as needed
                                    alt={card.name}
                                    className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                                />
                                <div className="relative bg-white pt-3">
                                    <h3 className="text-xl text-center text-gray-700 group-hover:underline group-hover:underline-offset-4">
                                        {card.name}
                                    </h3>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}