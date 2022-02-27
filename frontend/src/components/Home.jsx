import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import {UserContext} from "../context/UserContext";
import PokemonModal from "./PokemonModal";

const Home = () => {
    const [token] = useContext(UserContext);
    const [pokemons, setPokemons] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(`/api/pokemons/${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Failed to delete lead");
        }

        getPokemon();
    };

    const getPokemon = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch("/api/pokemons", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the pokemons");
        } else {
            const data = await response.json();
            setPokemons(data);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getPokemon();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getPokemon();
        setId(null);
    };

    return (
        <>
            <PokemonModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
                setErrorMessage={setErrorMessage}
            />
            <button
                className="button is-fullwidth mb-5 is-success">
                Favorite Pokemons
            </button>
            <ErrorMessage message={errorMessage}/>
            {loaded && pokemons ? (
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>URL</th>
                        <th>Added</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pokemons.map((pokemon) => (
                        <tr key={pokemon.id}>
                            <td>{pokemon.fav_pokemon}</td>
                            <td>{pokemon.url}</td>
                            <td>{moment(pokemon.date_last_updated).format("MMM Do YY")}</td>
                            <td>
                                <button
                                    className="button mr-2 is-danger is-light"
                                    onClick={() => handleDelete(pokemon.fav_id)}
                                >
                                    Remove From Favorite
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
};


export default Home;
