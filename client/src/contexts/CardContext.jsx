// CardContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CardContext = createContext();

export const useCardContext = () => {
    return useContext(CardContext);
};

export const CardProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Swal.fire({
            title: 'Game is loading...',
            text: 'Please wait while we fetch the cards.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const fetchCards = async () => {
            try {
                const response = await axios.get('https://api.pokemontcg.io/v2/cards');
                setCards(response.data.data);
                setLoading(false);
                Swal.close();
            } catch (err) {
                setError(err);
                setLoading(false);
                Swal.close();
            }
        };

        fetchCards();
    }, []);

    return (
        <CardContext.Provider value={{ cards, loading, error }}>
            {children}
        </CardContext.Provider>
    );
};