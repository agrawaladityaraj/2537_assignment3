import React from "react";
import { Card, Typography, Box, Button } from "@mui/joy";

function Pokemon(props) {
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
          onClick={() => props.openModal(props.id, props.name)}
        >
          More
        </Button>
      </Box>
    </Card>
  );
}

export default Pokemon;
