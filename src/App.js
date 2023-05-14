import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox } from "@mui/joy";
import { Pagination } from "@mui/material";

import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    (async () => {
      const pokeResult = await axios.get("https://pokeapi.co/api/v2/pokemon/");
      const typeResult = await axios.get("https://pokeapi.co/api/v2/type/");
      setPokemons(pokeResult.data.results);
      setTypes(
        typeResult.data.results.map((type) => ({ ...type, checked: false }))
      );
    })();
  }, []);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="filters">
          {types.map((type, index) => (
            <Checkbox
              sx={{ padding: "1em" }}
              label={type.name}
              variant="soft"
              key={type.url}
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
      </div>
    </div>
  );
}

export default App;
