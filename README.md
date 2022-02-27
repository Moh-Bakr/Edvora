### A fullstack application based on the Pokemon API (pokeapi.co) using
### FastAPI for the backend and React.js for the frontend

### Has the following features :

#### 1. Login / Signup with Authentication

![Alt text](README/login-register.png?raw=true "Login-Register")

#### 2. Storing the user’s favorite pokemon in a database and retrieving it with an authenticated API call

![Alt text](README/pokelist.png?raw=true "Pokemon List")

![Alt text](README/favlist.png?raw=true "Favorite List")

### How to Run the Project
#### install dependencies
```
pip3 install passlib[bcrypt] SQLALCHEMY fastapi[all] pyjwt
```
#### Create the Database
````
cd backend

source venv/bin/activate 

python3

import services 

services.create_database()

````
#### Run the APIS
````
uvicorn main:app --reload
````
#### Run the Frontend
````
cd frontend

npm start
````


### Backend (APIS)

![Alt text](README/apis.png?raw=true "APIS")

#### 1. Create User

##### Each user has a unique token

![Alt text](README/creatuser.png?raw=true "Create User")

#### 2. Create Pokemon

![Alt text](README/createpoke.png?raw=true "Create Pokemon")

#### 3. Get Pokemons

![Alt text](README/getpokemons.png?raw=true "Create Pokemon")


