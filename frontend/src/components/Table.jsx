import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import { BrowserRouter as Router, Switch,
    Route, Redirect,} from "react-router-dom";

import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import PokemonModal from "./PokemonModal";
import {UserContext} from "../context/UserContext";

const Table = () => {
    const [token] = useContext(UserContext);
    const [pokemons, setPokemons] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loaded, setLoaded] = useState(false);

    const addtofav = async (name, id) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                fav_pokemon: name,
                fav_id: id,
                pit_name: "sss",
                note: "sssss",

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
            {loaded && pokemons ? (
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th> Pokemon</th>
                        <th>id</th>
                        <th>Actions</th>

                    </tr>
                    </thead>
                    <tbody>
                    {pokemons.results.map((pokemon, id) => (
                        <tr key={pokemon.id}>
                            <td>{pokemon.name}</td>
                            <td>{id}</td>
                            <td>
                                <button
                                    className="button mr-2 is-info is-light"
                                    onClick={() => addtofav(pokemon.name, id)}
                                >
                                    Add favorite
                                </button>
                                <button
                                    className="button mr-2 is-danger is-light"
                                    onClick={() => removefromfav(id)}
                                >
                                    Remove favorite
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