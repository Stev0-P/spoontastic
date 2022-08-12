import React, { useEffect } from "react";
import { Box } from "@mui/material";

export const LogIn = () => {
  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID Token: " + response.credential);
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
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
    };
    document.body.append(script);
  }, []);

  return (
    <Box>
      <div className="signInDiv"></div>
    </Box>
  );
};
