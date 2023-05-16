import React from "react";
import { Card, Typography, Box, Button } from "@mui/joy";

function Pokemon(props) {
  // const [pokemon, setPokemon] = useState({
  //   abilities: [],
  //   stats: [],
  //   types: [],
  // });

  // useEffect(() => {
  //   (async () => {
  //     const pokeResult = await axios.get(
  //       `https://pokeapi.co/api/v2/pokemon/${props.id}/`
  //     );
  //     setPokemon({
  //       abilities: pokeResult.data.abilities,
  //       stats: pokeResult.data.stats,
  //       types: pokeResult.data.types,
  //     });
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Card variant="outlined">
      <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        {props.name}
      </Typography>
      <div style={{ textAlign: "center", height: "150px", width: "100%" }}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.id}.png`}
          loading="lazy"
          alt={props.name}
          style={{ height: "100%" }}
        />
      </div>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="solid"
          size="sm"
          color="primary"
          aria-label="More"
          sx={{ ml: "auto", fontWeight: 600 }}
        >
          More
        </Button>
      </Box>
    </Card>
  );
}

export default Pokemon;
