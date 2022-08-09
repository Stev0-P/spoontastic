import React, { useEffect } from "react";
import { Box } from "@mui/material";

export const LogIn = () => {
  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID Token: " + response.credential);
  }
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "310796731049-go21cqbgntnb8ld42p9m5gm4odh78487.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  }, []);

  return (
    <Box>
      <div className="signInDiv"></div>
    </Box>
  );
};
