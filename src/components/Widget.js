import React from "react";
import { Box, Typography, Chip } from "@mui/material";


const Widget = () => {
return (
    <Box sx={{display: 'flex', backgroundColor: "#f7a05e"}}>
      <Chip label="Name:" size="medium" sx={{fontSize: '1.5em', height: '2em',  boxShadow: 1, backgroundColor: "#f7a05e"}}/>
    </Box>
);
}

export default Widget;