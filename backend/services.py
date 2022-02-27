#!/usr/bin/env python3
import database as _database
import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import models as _models, schemas as _schemas
import datetime as _dt

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)
    token = _jwt.encode(user_obj.dict(), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")


async def get_current_user(
        db: _orm.Session = _fastapi.Depends(get_db),
        token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )
    return _schemas.User.from_orm(user)


async def create_Pokemon(user: _schemas.User, db: _orm.Session, pokemon: _schemas.PokemonCreate):
    pokemon = _models.Pokemon(**pokemon.dict(), owner_id=user.id)
    db.add(pokemon)
    db.commit()
    db.refresh(pokemon)
    return _schemas.Pokemon.from_orm(pokemon)


async def get_Pokemons(user: _schemas.User, db: _orm.Session):
    pokemons = db.query(_models.Pokemon).filter_by(owner_id=user.id)

    return list(map(_schemas.Pokemon.from_orm, pokemons))


async def _pokemon_selector(pokemon_id: int, user: _schemas.User, db: _orm.Session):
    pokemon = (
        db.query(_models.Pokemon)
            .filter_by(owner_id=user.id)
            .filter(_models.Pokemon.id == pokemon_id)
            .first()
    )
    if pokemon is None:
        raise _fastapi.HTTPException(status_code=404, detail="Pokemon does not exist")
    return pokemon


async def _pokemon_selectorsss(fav_id: int, user: _schemas.User, db: _orm.Session):
    pokemon = (
        db.query(_models.Pokemon)
            .filter_by(owner_id=user.id)
            .filter(_models.Pokemon.fav_id == fav_id)
            .first()
    )

    if pokemon is None:
        raise _fastapi.HTTPException(status_code=404, detail="Pokemon does not exist")
    return pokemon


async def get_Pokemon(pokemon_id: int, user: _schemas.User, db: _orm.Session):
    lead = await _pokemon_selector(pokemon_id=pokemon_id, user=user, db=db)

    return _schemas.Pokemon.from_orm(lead)


async def delete_Pokemon(fav_id: int, user: _schemas.User, db: _orm.Session):
    lead = await _pokemon_selectorsss(fav_id, user, db)

    db.delete(lead)
    db.commit()


async def update_Pokemon(pokemon_id: int, pokemon: _schemas.PokemonCreate, user: _schemas.User, db: _orm.Session):
    pokemon_db = await _pokemon_selector(pokemon_id, user, db)

    pokemon_db.fav_pokemon = pokemon.fav_pokemon
    pokemon_db.url = pokemon.url
    pokemon_db.date_last_updated = _dt.datetime.utcnow()

    db.commit()
    db.refresh(pokemon_db)

    return _schemas.Pokemon.from_orm(pokemon_db)
