import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import {UserContext} from "../context/UserContext";
import PokemonModal from "./PokemonModal";

const FavList = () => {
    const [token] = useContext(UserContext);
    const [FavPokemons, setFavPokemons] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const DeleteFav = async (id) => {
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

        GetFavPokemons();
    };

    const GetFavPokemons = async () => {
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
            setFavPokemons(data);
            setLoaded(true);
        }
    };

    useEffect(() => {
        GetFavPokemons();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        GetFavPokemons();
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
                Favorite FavPokemons
            </button>
            <ErrorMessage message={errorMessage}/>
            {loaded && FavPokemons ? (
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th>Favorite Name</th>
                        <th>URL</th>
                        <th>Added</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {FavPokemons.map((FavPokemon) => (
                        <tr key={FavPokemon.id}>
                            <td>{FavPokemon.fav_pokemon}</td>
                            <td>{FavPokemon.url}</td>
                            <td>{moment(FavPokemon.date_last_updated).format("MMM Do YY")}</td>
                            <td>
                                <button
                                    className="button mr-2 is-danger is-light"
                                    onClick={() => DeleteFav(FavPokemon.fav_id)}
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


export default FavList