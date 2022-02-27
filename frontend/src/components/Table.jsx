import React, {useContext, useEffect, useState} from "react";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import {UserContext} from "../context/UserContext";

const Table = () => {
    const [token] = useContext(UserContext);
    const [pokemons, setPokemons] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loaded, setLoaded] = useState(false);

    const addtofav = async (name, id, url) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                fav_pokemon: name,
                fav_id: id,
                url: url,
            }),
        };
        const response = await fetch("/api/Pokemons", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong when adding pokemon to the favorite");
        } else {
            setSuccessMessage("added successfully to the favorite")
        }
    };


    const removefromfav = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(`/api/pokemons/${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Failed to delete pokemons");
        }

        getPokemons();
    };

    const getPokemons = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch("https://pokeapi.co/api/v2/pokemon", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the pokemons");
        } else {
            const data = await response.json();
            setPokemons(data);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getPokemons();
    }, []);


    return (
        <>
            <ErrorMessage message={errorMessage}/>
            <SuccessMessage message={successMessage}/>
            <button
                className="button is-fullwidth mb-5 is-black">
                Pokemons List
            </button>
            {loaded && pokemons ? (
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th> Pokemon</th>
                        <th>Url</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pokemons.results.map((pokemon, id) => (
                        <tr key={pokemon.id}>
                            <td>{pokemon.name}</td>
                            <td>{pokemon.url}</td>
                            <td>
                                <button
                                    className="button mr-2 is-info is-light"
                                    onClick={() => addtofav(pokemon.name, id,pokemon.url)}>
                                    Add favorite
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

export default Table;