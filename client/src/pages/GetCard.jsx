import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function GetCard() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleCardClick = (card) => {
        Swal.fire({
            title: "Konfirmasi Pilihan Kartu",
            text: `Apakah Anda ingin memilih kartu ${card.name}?`,
            imageUrl: card.images?.small,
            imageWidth: 200,
            imageHeight: 280,
            imageAlt: card.name,
            showCancelButton: true,
            confirmButtonText: 'Ya, Pilih Kartu',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Navigasi ke halaman BattleRoom dengan card yang dipilih
                navigate('/battle-room', { state: { card } });
            }
        });
    };

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
                            <div
                                onClick={() => handleCardClick(card)}
                                className="group block overflow-hidden cursor-pointer"
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
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}