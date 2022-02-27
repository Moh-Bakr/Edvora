import datetime as _dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    hashed_password = _sql.Column(_sql.String)

    pokemons = _orm.relationship("Pokemon", back_populates="owner")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)


# class Pokemon(_database.Base):
#     __tablename__ = "pokemons"
#     id = _sql.Column(_sql.Integer, primary_key=True, index=True)
#     owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
#     fav_pokemon = _sql.Column(_sql.String, index=True)
#     fav_id = _sql.Column(_sql.Integer, default="")
#
#     owner = _orm.relationship("User", back_populates="pokemons")

class Pokemon(_database.Base):
    __tablename__ = "pokemons"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    fav_pokemon = _sql.Column(_sql.String, index=True)
    pit_name = _sql.Column(_sql.String, index=True)
    note = _sql.Column(_sql.String, default="")
    fav_id = _sql.Column(_sql.Integer, default="")

    date_created = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    date_last_updated = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)

    owner = _orm.relationship("User", back_populates="pokemons")
