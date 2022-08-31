import React, { useState, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { fontSize, textAlign } from "@mui/system";
import { accordionSummaryClasses, Container } from "@mui/material";
import Button from "@mui/material/Button";
import "./CheckBox.css";
import useTime from "../hooks/useTime";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import UserContext from "..//context/User";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CheckBox = () => {
  const [diet, setDiet] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const time = useTime();
  const [open, setOpen] = useState(false);
  const activeUser = useContext(UserContext);

  const dietChange = (event) => {
    setDiet(event.target.value);
  };

  // const intoleranceChange = (event) => {
  //   setIntolerance((prevState) => ({
  //     ...prevState,
  //     [event.target.value]: !prevState[event.target.value],
  //   }));
  // };

  const intoleranceChange = (event) => {
    if (intolerance === "") {
      setIntolerance(event.target.value);
    } else {
      setIntolerance(intolerance + "," + event.target.value);
    }
  };

  const submit = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/preferences/", {
          diet: diet,
          intolerances: intolerance,
          type: time.type,
          creator: activeUser.userId,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  const styler = {
    padding: "1em",
    flexGrow: 1,
    backgroundColor: "#f7a05e",
    borderRadius: "1em",
    margin: 2,
  };

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "2em",
        }}
      >
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="regular"
            name="radio-buttons-group"
            value={diet}
            onChange={dietChange}
            style={styler}
          >
            <FormLabel
              style={{
                color: "black",
                fontSize: "1.5em",
                paddingBottom: "1em",
              }}
            >
              Diet
            </FormLabel>
            <Box className="wrapper">
              <FormControlLabel value="regular" control={<Radio style={{ color: "green" }} />} label="Regular" />
              <FormControlLabel value="glutenFree" control={<Radio style={{ color: "green" }} />} label="Gluten Free" />
              <FormControlLabel value="ketogenic" control={<Radio style={{ color: "green" }} />} label="Ketogenic" />
              <FormControlLabel value="vegetarian" control={<Radio style={{ color: "green" }} />} label="Vegetarian" />
              <FormControlLabel
                value="lactoVegetarian"
                control={<Radio style={{ color: "green" }} />}
                label="Lacto-Vegetarian"
              />
              <FormControlLabel
                value="ovoVegetarian"
                control={<Radio style={{ color: "green" }} />}
                label="Ovo-Vegetarian"
              />
              <FormControlLabel value="vegan" control={<Radio style={{ color: "green" }} />} label="Vegan" />
              <FormControlLabel
                value="pescetarian"
                control={<Radio style={{ color: "green" }} />}
                label="Pescetarian"
              />
              <FormControlLabel value="paleo" control={<Radio style={{ color: "green" }} />} label="Paleo" />
              <FormControlLabel value="primal" control={<Radio style={{ color: "green" }} />} label="Primal" />
              <FormControlLabel value="lowFodmap" control={<Radio style={{ color: "green" }} />} label="Low FODMAP" />
              <FormControlLabel value="whole30" control={<Radio style={{ color: "green" }} />} label="Whole30" />
            </Box>
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormGroup defaultValue="regular" value={intolerance} onChange={intoleranceChange} style={styler}>
            <FormLabel
              style={{
                display: "flex",
                color: "black",
                fontSize: "1.5em",
                paddingBottom: "1em",
              }}
            >
              Intolerences
            </FormLabel>
            <Box className="wrapper">
              <FormControlLabel control={<Checkbox value="dairy" style={{ color: "green" }} />} label="Dairy" />
              <FormControlLabel control={<Checkbox value="egg" style={{ color: "green" }} />} label="Egg" />
              <FormControlLabel control={<Checkbox value="gluten" style={{ color: "green" }} />} label="Gluten" />
              <FormControlLabel control={<Checkbox value="grain" style={{ color: "green" }} />} label="Grain" />
              <FormControlLabel control={<Checkbox value="peanut" style={{ color: "green" }} />} label="Peanut" />
              <FormControlLabel control={<Checkbox value="seafood" style={{ color: "green" }} />} label="Seafood" />
              <FormControlLabel control={<Checkbox value="sesame" style={{ color: "green" }} />} label="Sesame" />
              <FormControlLabel control={<Checkbox value="shellfish" style={{ color: "green" }} />} label="Shellfish" />
              <FormControlLabel control={<Checkbox value="soy" style={{ color: "green" }} />} label="Soy" />
              <FormControlLabel control={<Checkbox value="sulfite" style={{ color: "green" }} />} label="Sulfite" />
              <FormControlLabel control={<Checkbox value="tree-nut" style={{ color: "green" }} />} label="Tree Nut" />
              <FormControlLabel control={<Checkbox value="wheat" style={{ color: "green" }} />} label="Wheat" />
            </Box>
          </FormGroup>
        </FormControl>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Please Select Your Preferences!
          </Alert>
        </Snackbar>
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          diet === "" || intolerance === "" ? handleClick() : (submit())((window.location.href = "/dashboard"));
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

//((window.location.href = "/dashboard"))
export default CheckBox;
