import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Checkbox,
  Grid,
  Modal,
  Sheet,
  ModalClose,
  Typography,
  Box,
} from "@mui/joy";
import { Pagination } from "@mui/material";

import Pokemon from "./Pokemon";
import "./App.css";

const emptyPokemon = {
  abilities: [],
  stats: [],
  types: [],
  name: "",
  id: 0,
};

const getId = (url) => {
  const splits = url.split("/");
  return splits[splits.length - 2];
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [modalPokemon, setModalPokemon] = useState(emptyPokemon);

  const openModal = async (id, name) => {
    const pokeResult = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${id}/`
    );
    setModalPokemon({
      abilities: pokeResult.data.abilities,
      stats: pokeResult.data.stats,
      types: pokeResult.data.types,
      name,
      id,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setModalPokemon(emptyPokemon);
  };

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

  useEffect(() => {
    setPage(1);
  }, [filteredPokemons]);

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
        <Box sx={{ textAlign: "center" }}>
          <Typography>Total Pokémon: {filteredPokemons.length}</Typography>
          <Typography>
            Showing {(page - 1) * 10 + 1} -{" "}
            {page * 10 ? filteredPokemons.length : page * 10}
          </Typography>
        </Box>
        <Grid sx={{ mb: "2em" }} container spacing={2}>
          {filteredPokemons.slice((page - 1) * 10, page * 10).map((pokemon) => (
            <Grid key={pokemon.name} xs={12} sm={6} md={4} lg={3}>
              <Pokemon
                id={pokemon.id}
                name={pokemon.name}
                openModal={openModal}
              />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(filteredPokemons.length / 10.0)}
          boundaryCount={0}
          siblingCount={2}
          page={page}
          color="primary"
          showFirstButton
          showLastButton
          onChange={(_, p) => setPage(p)}
        />
      </div>
      <Modal
        open={open}
        onClose={closeModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: 300,
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "background.body",
            }}
          />
          <Typography
            component="h2"
            id="modal-title"
            level="h3"
            textColor="inherit"
            fontWeight="lg"
          >
            {modalPokemon.name}
          </Typography>
          <Typography
            component="h3"
            id="modal-title"
            level="h5"
            textColor="inherit"
            fontWeight="md"
            mb={1}
          >
            {modalPokemon.id}
          </Typography>
          <div style={{ textAlign: "center", height: "150px", width: "100%" }}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${modalPokemon.id}.png`}
              loading="lazy"
              alt={modalPokemon.name}
              style={{ height: "100%" }}
            />
          </div>
          <Typography
            component="h3"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="md"
          >
            Abilities
          </Typography>
          <ul>
            {modalPokemon.abilities.map((ability, index) => (
              <li key={index}>
                <Typography id="modal-desc" textColor="text.tertiary">
                  {ability.ability.name}
                </Typography>
              </li>
            ))}
          </ul>
          <Typography
            component="h3"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="md"
          >
            Stats
          </Typography>
          <ul>
            {modalPokemon.stats.map((stat, index) => (
              <li key={index}>
                <Typography id="modal-desc" textColor="text.tertiary">
                  {stat.stat.name}
                </Typography>
              </li>
            ))}
          </ul>
          <Typography
            component="h3"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="md"
          >
            Types
          </Typography>
          <ul>
            {modalPokemon.types.map((type, index) => (
              <li key={index}>
                <Typography id="modal-desc" textColor="text.tertiary">
                  {type.type.name}
                </Typography>
              </li>
            ))}
          </ul>
        </Sheet>
      </Modal>
    </div>
  );
}

export default App;
