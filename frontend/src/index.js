import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.min.css";
import App from "./App";
import {UserProvider} from "./context/UserContext";

// ReactDOM.render(<App/>, document.getElementById("root"));

ReactDOM.render(
    <UserProvider>
        <App/>
    </UserProvider>,
    document.getElementById("root")
);
