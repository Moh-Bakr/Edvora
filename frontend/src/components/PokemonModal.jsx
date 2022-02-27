import React, {useEffect, useState} from "react";

const PokemonModel = ({active, handleModal, token, id, setErrorMessage}) => {
    const [fav_pokemon, setfav_pokemon] = useState("");
    const [pit_name, setpit_name] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        const getPokemon = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(`/api/pokemons/${id}`, requestOptions);

            if (!response.ok) {
                setErrorMessage("Could not get the Pokemon");
            } else {
                const data = await response.json();
                setfav_pokemon(data.fav_pokemon);
                setpit_name(data.pit_name);
                setNote(data.note);
            }
        };

        if (id) {
            getPokemon();
        }
    }, [id, token]);

    const cleanFormData = () => {
        setfav_pokemon("");
        setpit_name("");
        setNote("");
    };

    const handleCreatePokemon = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                fav_pokemon: fav_pokemon,
                pit_name: pit_name,
                note: note,
            }),
        };
        const response = await fetch("/api/Pokemons", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong when creating Pokemon");
        } else {
            cleanFormData();
            handleModal();
        }
    };

    const handleUpdatePokemon = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                fav_pokemon: fav_pokemon,
                pit_name: pit_name,
                note: note,
            }),
        };
        const response = await fetch(`/api/pokemons/${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong when updating the model");
        } else {
            cleanFormData();
            handleModal();
        }
    };

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {id ? "Update Pokemon" : "Create Pokemon"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">favorite pokemon</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter favorite Pokemon"
                                    value={fav_pokemon}
                                    onChange={(e) => setfav_pokemon(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Last Name</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter pit name"
                                    value={pit_name}
                                    onChange={(e) => setpit_name(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Note</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? (
                        <button className="button is-info" onClick={handleUpdatePokemon}>
                            Update
                        </button>
                    ) : (
                        <button className="button is-primary" onClick={handleCreatePokemon}>
                            Create
                        </button>
                    )}
                    <button className="button" onClick={handleModal}>
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PokemonModel;