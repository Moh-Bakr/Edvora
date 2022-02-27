import React, {useContext, useEffect, useState} from "react";
import Header from "./components/Header";
import {UserContext} from "./context/UserContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Table from "./components/Table";
import Home from "./components/Home";


const App = () => {
    const [message, setMessage] = useState("");
    const [token] = useContext(UserContext);
    let Showfav = true;

    const getWelcomeMessage = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch("/api", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            console.log("Error: " + response.message);
        } else {
            setMessage(data.message);
        }
    };
    const show = () => {
        console.log(Showfav);
        Showfav = !Showfav;
    }
    useEffect(() => {
        getWelcomeMessage();
    }, []);
    return (
        <>
            <Header title={message}/>
            <div className="columns">
                <div className="column"></div>
                <div className="column m-5 is-two-thirds">
                    {!token ? (
                            <div className="columns">
                                <Register/> <Login/>
                            </div>
                        ) :
                        <div>
                            <Home/><Table/>
                        </div>
                    }
                </div>
                <div className="column"></div>
            </div>
        </>
    );
};

export default App;