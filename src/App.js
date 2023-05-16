import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Grid } from "@mui/joy";
import { Pagination } from "@mui/material";

import Pokemon from "./Pokemon";
import "./App.css";

const getId = (url) => {
  const splits = url.split("/");
  return splits[splits.length - 2];
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [types, setTypes] = useState([]);

  const getAllTypes = async () => {
    const result = await axios.get("https://pokeapi.co/api/v2/type/");
    setTypes(
      result.data.results.map((type) => ({
        name: type.name,
        id: getId(type.url),
        checked: false,
      }))
    );
  };

  const getAllPokemons = async () => {
    const result = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=810"
    );
    const pokes = result.data.results.map((pokemon) => ({
      name: pokemon.name,
      id: getId(pokemon.url),
    }));
    setPokemons(pokes);
    setFilteredPokemons(pokes);
  };

  useEffect(() => {
    (async () => {
      await getAllTypes();
      await getAllPokemons();
    })();
  }, []);

  useEffect(() => {
    let checked = [];
    for (let i = 0; i < types.length; i++) {
      if (types[i].checked) {
        checked.push(types[i].id);
      }
    }
    (async () => {
      if (checked.length) {
        let checkedTypePokemons = await Promise.all(
          checked.map((type) =>
            axios.get(`https://pokeapi.co/api/v2/type/${type}`)
          )
        );
        Promise.allSettled(checkedTypePokemons).then(() => {
          checkedTypePokemons = checkedTypePokemons.map((pokes) =>
            pokes.data.pokemon.map((poke) => ({
              name: poke.pokemon.name,
              id: getId(poke.pokemon.url),
            }))
          );
          setFilteredPokemons(
            checkedTypePokemons.reduce((accumulator, current) => {
              return accumulator.filter((poke) =>
                current.some((innerPoke) => innerPoke.id === poke.id)
              );
            })
          );
        });
      } else {
        setFilteredPokemons(pokemons);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types]);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="filters">
          {types.map((type, index) => (
            <Checkbox
              sx={{ padding: "1em" }}
              label={type.name}
              variant="soft"
              key={type.id}
              checked={type.checked}
              onChange={(_) =>
                setTypes([
                  ...types.slice(0, index),
                  { ...type, checked: !type.checked },
                  ...types.slice(index + 1, types.length),
                ])
              }
            />
          ))}
        </div>
        <Grid container spacing={2}>
          {filteredPokemons.map((pokemon) => (
            <Grid key={pokemon.name} xs={12} sm={6} md={4} lg={3}>
              <Pokemon id={pokemon.id} name={pokemon.name} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default App;
