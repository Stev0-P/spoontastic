import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import UserContext from "../context/User";
import { useContext } from "react";
import { TextField } from "@mui/material";
import {
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
  Slider,
} from "@mui/material";
import { FaceTwoTone } from "@mui/icons-material";

const FilterDrawer = ({
  sendDiet,
  sendIntolerances,
  sendType,
  sendReadyTime,
  sendMinCalories,
  sendMaxCalories,
  sendMinProtein,
  sendMaxProtein,
  sendMinCarbs,
  sendMaxCarbs,
  sendMinFat,
  sendMaxFat,
  sendSubmitted,
}) => {
  const activeUser = useContext(UserContext);
  const [state, setState] = React.useState({
    right: false,
  });

  const [diet, setDiet] = React.useState("");
  const [type, setType] = React.useState("");
  const [maxReadyTime, setMaxReadyTime] = React.useState(0);

  const [calories, setCalories] = React.useState([0, 400]);
  const [minCalories, setMinCalories] = React.useState(0);
  const [maxCalories, setMaxCalories] = React.useState(0);

  const [protein, setProtein] = React.useState([10, 150]);
  const [minProtein, setMinProtein] = React.useState(0);
  const [maxProtein, setMaxProtein] = React.useState(0);

  const [carbs, setCarbs] = React.useState([10, 150]);
  const [minCarbs, setMinCarbs] = React.useState(0);
  const [maxCarbs, setMaxCarbs] = React.useState(0);

  const [fat, setFat] = React.useState([10, 150]);
  const [minFat, setMinFat] = React.useState(0);
  const [maxFat, setMaxFat] = React.useState(0);

  const [intolerance, setIntolerance] = React.useState("");
  const [intolToString, setIntolToString] = React.useState([]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const dietList = [
    "Regular",
    "Gluten Free",
    "Ketogenic",
    "Vegeterian",
    "Lacto-Vegeterian",
    "Ovo-Vegeterian",
    "Vegan",
    "Pescaterian",
    "Paleo",
    "Primal",
    "Whole30",
  ];

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
  const handleIntoleranceChange = (event) => {
    const {
      target: { value },
    } = event;
    setIntolToString(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleDietChange = (event) => {
    setDiet(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleTimeChange = (event, newValue) => {
    setMaxReadyTime(newValue);
  };

  const handleCalorieChange = (event, newValue) => {
    setCalories(newValue);
    setMinCalories(calories[0]);
    setMaxCalories(calories[1]);
  };

  const handleProteinChange = (event, newValue) => {
    setProtein(newValue);
    setMinProtein(protein[0]);
    setMaxProtein(protein[1]);
  };

  const handleCarbsChange = (event, newValue) => {
    setCarbs(newValue);
    setMinCarbs(carbs[0]);
    setMaxCarbs(carbs[1]);
  };

  const handleFatChange = (event, newValue) => {
    setFat(newValue);
    setMinFat(fat[0]);
    setMaxFat(fat[1]);
  };

  const handleSubmit = (anchor) => {
    sendDiet(diet);
    sendType(type);
    sendIntolerances(intolToString);
    sendReadyTime(maxReadyTime);
    sendMinCalories(minCalories);
    sendMaxCalories(maxCalories);
    sendMinProtein(minProtein);
    sendMaxProtein(maxProtein);
    sendMinCarbs(minCarbs);
    sendMaxCarbs(maxCarbs);
    sendMinFat(minFat);
    sendMaxFat(maxFat);
    sendSubmitted(true);
    console.log(state);
    toggleDrawer(anchor, false);
    console.log(state);
  };

  const list = (anchor) => (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ marginTop: "1vh", padding: "1vh" }}>
        <Box sx={{ paddingBottom: "0.5vh" }}>
          <Typography variant="h4">Filter</Typography>
        </Box>
        <FormControl sx={{ width: "100%" }}>
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
            <MenuItem value="vegetarian">Vegetarian</MenuItem>
            <MenuItem value="lacto-vegetarian">Lacto-Vegetarian</MenuItem>
            <MenuItem value="ovo-vegetarian">Ovo-Vegetarian</MenuItem>
            <MenuItem value="vegan">Vegan</MenuItem>
            <MenuItem value="pescaterian">Pescaterian</MenuItem>
            <MenuItem value="paleo">Paleo</MenuItem>
            <MenuItem value="primal">Primal</MenuItem>
            <MenuItem value="whole30">Whole 30</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Box sx={{ padding: "1vh" }}>
        <Box sx={{ paddingBottom: "1vh" }}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel htmlFor="your-intolerance">Your Intolerance</InputLabel>
            <Select
              autoFocus
              value={intolToString}
              multiple
              onChange={handleIntoleranceChange}
              label="your-Intolerance"
              inputProps={{
                name: "your-intolerance",
                id: "your-intolerance",
              }}
              input={<OutlinedInput label="Your Intolerance" />}
            >
              {intoleranceList.map((intolerance) => (
                <MenuItem key={intolerance} value={intolerance}>
                  {intolerance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box sx={{ paddingTop: "1vh" }}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel htmlFor="food-type">Food Type</InputLabel>
            <Select
              autoFocus
              value={type}
              onChange={handleTypeChange}
              label="Food Type"
              inputProps={{
                name: "food-type",
                id: "food-type",
              }}
            >
              <MenuItem value="main course">Main Course</MenuItem>
              <MenuItem value="side dish">Side Dish</MenuItem>
              <MenuItem value="dessert">Dessert</MenuItem>
              <MenuItem value="appetizer">Appetizer</MenuItem>
              <MenuItem value="salad">Salad</MenuItem>
              <MenuItem value="breakfast">Breakfast</MenuItem>
              <MenuItem value="soup">Soup</MenuItem>
              <MenuItem value="beverage">Beverage</MenuItem>
              <MenuItem value="sauce">Sauce</MenuItem>
              <MenuItem value="marinade">Marinade</MenuItem>
              <MenuItem value="snack">Snack</MenuItem>
              <MenuItem value="fingerfood">Fingerfood</MenuItem>
              <MenuItem value="drink">Drink</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box>
          <Typography variant={"h6"}>Ready in {maxReadyTime} minutes</Typography>
          <Box sx={{ paddingLeft: "0.25vh", paddingRight: "1vh", paddingBottom: "0.5vh" }}>
            <Slider
              getAriaLabel={() => "Max Cooking Time"}
              value={maxReadyTime}
              onChange={handleTimeChange}
              defaultValue={50}
              max={180}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant={"h6"}>Calories</Typography>
          <Box sx={{ paddingLeft: "1vh", paddingRight: "1vh", paddingBottom: "0.5vh" }}>
            <Slider
              getAriaLabel={() => "Calories"}
              value={calories}
              onChange={handleCalorieChange}
              defaultValue={600}
              max={2000}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "1vh" }}>
            <TextField
              value={minCalories}
              //   onChange={handleMinProteinChange}
              sx={{ marginRight: "1vh" }}
              id="outlined-basic"
              label="Min"
              variant="outlined"
            />
            <TextField
              value={maxCalories}
              //   onChange={handleMaxProteinChange}
              id="outlined-basic"
              label="Max"
              variant="outlined"
            />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant={"h6"}>Protein</Typography>
          <Box sx={{ paddingLeft: "1vh", paddingRight: "1vh", paddingBottom: "0.5vh" }}>
            <Slider
              getAriaLabel={() => "Protein"}
              value={protein}
              onChange={handleProteinChange}
              defaultValue={50}
              max={180}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "1vh" }}>
            <TextField
              value={minProtein}
              //   onChange={handleMinProteinChange}
              sx={{ marginRight: "1vh" }}
              id="outlined-basic"
              label="Min"
              variant="outlined"
            />
            <TextField
              value={maxProtein}
              //   onChange={handleMaxProteinChange}
              id="outlined-basic"
              label="Max"
              variant="outlined"
            />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant={"h6"}>Carbs</Typography>
          <Box sx={{ paddingLeft: "1vh", paddingRight: "1vh", paddingBottom: "0.5vh" }}>
            <Slider
              getAriaLabel={() => "Carbs"}
              value={carbs}
              onChange={handleCarbsChange}
              defaultValue={50}
              max={180}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "1vh" }}>
            <TextField
              value={minCarbs}
              // onChange={handleMinCarbsChange}
              sx={{ marginRight: "1vh" }}
              id="outlined-basic"
              label="Min"
              variant="outlined"
            />
            <TextField
              value={maxCarbs}
              // onChange={handleMaxCarbsChange}
              id="outlined-basic"
              label="Max"
              variant="outlined"
            />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant={"h6"}>Fat</Typography>
          <Box sx={{ paddingLeft: "1vh", paddingRight: "1vh", paddingBottom: "0.5vh" }}>
            <Slider
              getAriaLabel={() => "Fat"}
              value={fat}
              onChange={handleFatChange}
              defaultValue={50}
              max={180}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "1vh" }}>
            <TextField
              value={minFat}
              //  onChange={handleMinFatChange}
              sx={{ marginRight: "1vh" }}
              id="outlined-basic"
              label="Min"
              variant="outlined"
            />
            <TextField
              value={maxFat}
              // obChange={handleMaxFatChange}
              id="outlined-basic"
              label="Max"
              variant="outlined"
            />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{ padding: "1vh", display: "flex", justifyContent: "center", marginTop: "2vh" }}
          onClick={toggleDrawer(anchor, false)}
        >
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ paddingLeft: "vh" }}>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton size="large" onClick={toggleDrawer(anchor, true)}>
            <DensityMediumIcon />
          </IconButton>

          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default FilterDrawer;
