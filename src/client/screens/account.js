import React, { useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/system";
import { Chip, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import UserContext from "..//context/User";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Switch from "@mui/material/Switch";

const Account = () => {
  const activeUser = useContext(UserContext);

  //--------------------------------
  const [open, setOpen] = React.useState(false);
  const [diet, setDiet] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const [intolToString, setIntolToString] = useState([]);

  const intoleranceList = [
    "Dairy",
    "Egg",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat",
  ];

  useEffect(() => {
    setIntolerance(intolToString.join(","));
  }, [intolToString]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDietChange = (event) => {
    setDiet(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleIntoleranceChange = (event) => {
    console.log(event);
    const {
      target: { value },
    } = event;
    setIntolToString(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async () => {
    console.log(intolerance);

    const { data: response } = await axios.patch("/api/preferences/change", {
      diet: diet === "" ? activeUser.diet : diet,
      intolerance: intolerance === "" ? activeUser.intolerance : intolerance,
    });
    console.log(response);
    handleClose();
    window.location.reload();
  };

  //-----------------------------

  const handleClickPreferences = () => {
    console.info("You clicked the Chip.");
  };
  const history = useHistory();

  const userLogout = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete("/api/account/logout");
        navLogin(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };
  const navLogin = (response) => {
    if (response === true) {
      history.push("/login");
      console.log("navigate to login");
    } else {
      console.log("unable to logout");
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 2, flexGrow: 1 }}>
        <Typography variant="h1" component="div">
          {" "}
          Account
        </Typography>
        <Box>
          <Box sx={{ marginTop: 3, marginBottom: 3 }}>
            <Chip
              label="Name:"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
            />
            <Chip
              label={activeUser.name}
              variant="outlined"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
            />
          </Box>
          <Box display="flex" sx={{ flexDirection: "row" }}>
            <Chip
              label="E-Mail:"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
            />
            <Chip
              label={activeUser.email}
              variant="outlined"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
            />
            <Box sx={{ flexDirection: "row-reverse" }}>
              <Chip
                label="Log Out"
                variant="outlined"
                color="error"
                onClick={userLogout}
                sx={{ fontSize: "1.5em", fontWeight: "bold", height: "2em", borderWidth: "1.75px", marginLeft: 4 }}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 3, marginRight: 5, marginBottom: 1 }}>
            <Divider />
            <Divider sx={{ marginTop: 1 }} />
          </Box>
          <Box sx={{ marginTop: 3, marginBottom: 3 }}>
            <Chip
              label="Diet:"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
            />
            <Chip
              label={activeUser.diet}
              variant="outlined"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
            />
          </Box>
          <Box display="flex" sx={{ flexDirection: "row" }}>
            <Chip
              label="Intolerances:"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
            />
            <Box>
              <Chip
                label={activeUser.intolerance}
                variant="outlined"
                size="medium"
                sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
              />

              <Chip
                label="Change Preferences"
                variant="outlined"
                color="error"
                onClick={handleClickOpen}
                sx={{ fontSize: "1.5em", fontWeight: "bold", height: "2em", borderWidth: "1.75px", marginLeft: 4 }}
              />
              <Dialog fullWidth={false} maxWidth="sm" open={open} onClose={handleClose}>
                <DialogTitle>Intolerances Change</DialogTitle>
                <DialogContent>
                  <DialogContentText>You can change your intolerances within this window.</DialogContentText>
                  <Box
                    noValidate
                    component="form"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                      <InputLabel htmlFor="your-diet">Your Diet</InputLabel>
                      <Select
                        autoFocus
                        value={diet}
                        onChange={handleDietChange}
                        label="Your Diet"
                        inputProps={{
                          name: "your-diet",
                          id: "your-diet",
                        }}
                      >
                        <MenuItem value="regular">Regular</MenuItem>
                        <MenuItem value="gluten free">Gluten Free</MenuItem>
                        <MenuItem value="ketogenic">Ketogenic</MenuItem>
                        <MenuItem value="vegeterian">Vegeterian</MenuItem>
                        <MenuItem value="lacto-vegeterian">Lacto-Vegeterian</MenuItem>
                        <MenuItem value="ovo-vegeterian">Ovo-Vegeterian</MenuItem>
                        <MenuItem value="vegan">Vegan</MenuItem>
                        <MenuItem value="pesceterian">Pesceterian</MenuItem>
                        <MenuItem value="paleo">Paleo</MenuItem>
                        <MenuItem value="primal">Primal</MenuItem>
                        <MenuItem value="lowFoodmap">lowFoodmap</MenuItem>
                        <MenuItem value="whole30">whole30</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2, minWidth: 180, marginLeft: "5%" }}>
                      <InputLabel htmlFor="your-intolerance">Your Intolerance</InputLabel>
                      <Select
                        autoFocus
                        value={intolToString}
                        multiple
                        onChange={handleIntoleranceChange}
                        label="Your-Intolerance"
                        inputProps={{
                          name: "your-intolerance",
                          id: "your-intolerance",
                        }}
                        input={<OutlinedInput label="Name" />}
                      >
                        {intoleranceList.map((intolerance) => (
                          <MenuItem key={intolerance} value={intolerance}>
                            {intolerance}
                          </MenuItem>
                        ))}
                        {/* <MenuItem value="egg">Egg</MenuItem>
                        <MenuItem value="gluten">Gluten</MenuItem>
                        <MenuItem value="grain">Grain</MenuItem>
                        <MenuItem value="peanut">Peanut</MenuItem>
                        <MenuItem value="seafood">Seafood</MenuItem>
                        <MenuItem value="sesame">Sesame</MenuItem>
                        <MenuItem value="shellfish">Shellfish</MenuItem>
                        <MenuItem value="soy">Soy</MenuItem>
                        <MenuItem value="sulfite">Sulfite</MenuItem>
                        <MenuItem value="tree-nut">Tree-Nut</MenuItem>
                        <MenuItem value="">Wheat</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button sx={{ flex: "start" }} onClick={handleSubmit}>
                    Submit
                  </Button>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", marginTop: 10, marginRight: "15%", marginLeft: "15%" }}>
          <Chip
            label="Return"
            variant="outlined"
            color="success"
            onClick={() => history.goBack()}
            sx={{ fontSize: "1.5em", fontWeight: "bold", height: "2em", borderWidth: "1.75px" }}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Account;
