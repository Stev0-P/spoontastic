import React from "react";
import { Box } from "@mui/system";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Skeleton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import parse from "html-react-parser";
import axios from "axios";
import UserContext from "../context/User";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { orange } from "@mui/material/colors";
import { response } from "express";
import { trusted } from "mongoose";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: "white",
}));

const Recipe = () => {
  const history = useHistory();
  const location = useLocation();
  const recipeID = location.pathname.split("/").pop();
  //console.log(recipeID);
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  const [refresh, setRefresh] = useState(false);
  const [recDiet, setRecDiet] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [method, setMethod] = useState([]);

  const [currentDiet, setCurrentDiet] = useState("");
  const [alert, setAlert] = useState(false);
  const [matched, setMatched] = useState();
  const [favourited, setFavourited] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [favRating, setFavRating] = React.useState(0);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [deleted, setDeleted] = useState(0);

  const activeUser = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [diets, setDiets] = useState([]);
  const [dishTypes, setDishTypes] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  const handleClickSnack = () => {
    setOpen(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //Get Recipe Information
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get(`/api/recipes/item/${recipeID}`);
        setRecipe(response);
        setMethod(response.analyzedInstructions[0].steps);
        setIngredients(response.nutrition.ingredients);
        setDiets(response.diets);
        // console.log(response);
        setCuisines(response.cuisines);
        setDishTypes(response.dishTypes);

        //ratingScore(response.healthScore);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchApi();

    //Get Rating of the Recipe if Exists
    const fetchApi2 = async () => {
      try {
        const { data: response } = await axios.get(`/api/ratings/${activeUser.userId}/${recipeID}`);
        setRating(response.rating[0].rating);
      } catch (err) {
        console.log(err);
      }
    };

    //Check if this recipe already favourited
    const fetchApi3 = async () => {
      try {
        const { data: response } = await axios.get(`/api/favourites/${activeUser.userId}/${recipeID}`);
        // console.log(response.recipe.length);
        if (response.recipe.length === 0) {
          setFavourited(false);
        } else {
          setFavourited(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchApi2();
    fetchApi3();
  }, [recipeID]);

  //add Recipe to database
  useEffect(() => {
    const fetchApi4 = async () => {
      try {
        const { data: response } = await axios.post("/api/recipes/addRecipe/", {
          recipeID: recipeID,
          title: recipe.title,
          image: recipe.image,
          cuisine: recipe.cuisines,
          type: recipe.dishTypes,
          diets: recipe.diets,
          servings: recipe.servings,
          readyInMinutes: recipe.readyInMinutes,
        });

        // console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi4();
    setRecDiet(recipe.diets);
    setRefresh(true);
    dietParse();
  }, [recipe]);

  useEffect(() => {
    if (recDiet !== undefined && recipe.diets) {
      if (recDiet?.length === 0 && currentDiet !== "regular") {
        setMatched(false);
      }
      for (var i = 0; i <= recDiet?.length; i++) {
        if (currentDiet === "regular") {
          setMatched(true);
          break;
        } else if (currentDiet === "pescatarian" && (recipe.vegetarian === true || currentDiet === recDiet[i])) {
          setMatched(true);
          break;
        } else if (currentDiet === recDiet[i]) {
          setMatched(true);
          break;
        } else if (recDiet?.length !== 0) {
          setMatched(false);
        }
      }
    }
  }, [recDiet]);

  useEffect(() => {
    if (matched !== undefined) {
      if (matched === false) {
        setAlert(true);
      } else {
      }
    }
  }, [matched]);

  const dietParse = () => {
    if (activeUser.diet === "gluten free") {
      setCurrentDiet("gluten free");
    } else if (activeUser.diet === "ketogenic") {
      setCurrentDiet("ketogenic");
    } else if (activeUser.diet === "vegetarian") {
      setCurrentDiet("vegetarian");
    } else if (activeUser.diet === "lacto-vegetarian") {
      setCurrentDiet("lacto ovo vegetarian");
    } else if (activeUser.diet === "ovo-vegetarian") {
      setCurrentDiet("lacto ovo vegetarian");
    } else if (activeUser.diet === "vegan") {
      setCurrentDiet("vegan");
    } else if (activeUser.diet === "pescatarian") {
      setCurrentDiet("pescatarian");
    } else if (activeUser.diet === "paleo") {
      setCurrentDiet("paleolithic");
    } else if (activeUser.diet === "primal") {
      setCurrentDiet("primal");
    } else if (activeUser.diet === "whole30") {
      setCurrentDiet("whole 30");
    } else if (activeUser.diet === "regular") {
      setCurrentDiet("regular");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Add Recipe to Favourites
  const onFavourite = (item) => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/favourites/", {
          title: recipe.title,
          image: recipe.image,
          creator: activeUser.userId,
          recipeID: recipeID,
        });

        setFavourited(true);
        setOpenSnack(true);
        setOpen(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
    setRating(favRating);
  };

  //save Rating to the databse
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/ratings/", {
          rating: rating,
          creator: activeUser.userId,
          recipeID: recipeID,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  }, [rating]);

  //Delete The recipe from database
  const onDelete = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete(`/api/favourites/delete/${recipeID}`);
        setDeleted((prevState) => prevState + 1);
        setFavourited(false);
        setOpenSnack(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  return (
    <Box sx={{ marginLeft: { xs: "5vh", md: "18vh" } }}>
      {loading === false ? (
        <Box sx={{ display: " flex", flexDirection: "column" }}>
          {alert === true ? (
            <Alert severity="warning" sx={{ padding: "10px" }}>
              <AlertTitle>Warning</AlertTitle>
              This recipe may not match your dietary and/or intolerance preferences.
            </Alert>
          ) : (
            ""
          )}
          <Box sx={{ marginLeft: 3, marginTop: 4 }}>
            <Typography variant="h3">{recipe.title}</Typography>
          </Box>
          <Box sx={{ marginLeft: 3, marginTop: 2, flexDirection: "row" }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Rating
                  name="simple-controlled"
                  size="large"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <List
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "0px",
                    marginBottom: "0px",
                    paddingTop: "0px",
                  }}
                >
                  <ListItemText
                    sx={{
                      paddingLeft: { xs: "0.5em", md: "1em" },
                      marginTop: "0px",
                      marginBottom: "0px",
                      paddingTop: "0px",
                    }}
                    primary={"Cooking Time"}
                    secondary={`${recipe.readyInMinutes} minutes`}
                  ></ListItemText>
                  <ListItemText
                    sx={{
                      paddingLeft: { xs: "0.5em", md: "1em" },
                      marginTop: "0px",
                      marginBottom: "0px",
                      paddingTop: "0px",
                    }}
                    primary={"Serving"}
                    secondary={`${recipe.servings}`}
                  ></ListItemText>
                </List>
              </Box>
              <Box sx={{ display: "flex" }}>
                {favourited === false ? (
                  <IconButton
                    size="large"
                    sx={{ marginRight: 0, marginLeft: 0 }}
                    selected={favourited}
                    onClick={handleClickOpen}
                  >
                    <StarIcon fontSize="large" />
                  </IconButton>
                ) : (
                  <IconButton
                    size="large"
                    sx={{ marginRight: 0, marginLeft: 0 }}
                    //selected={favourited}
                    onClick={
                      //onFavourite(recipe);
                      //handleClickOpen
                      onDelete
                    }
                  >
                    <StarIcon color="warning" fontSize="large" />
                  </IconButton>
                )}
              </Box>
              <Dialog fullWidth={false} maxWidth="sm" open={open} onClose={handleClose}>
                <DialogTitle>Rate This Recipe</DialogTitle>
                <DialogContent>
                  <DialogContentText>Give this recipe a rating and add to favourites.</DialogContentText>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", paddingTop: "2vh" }}>
                      <Rating
                        name="simple-controlled"
                        size="large"
                        value={favRating}
                        onChange={(event, newValue) => {
                          setFavRating(newValue);
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                      <Button sx={{ flex: "start" }} onClick={onFavourite}>
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </DialogContent>
              </Dialog>
              <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                {deleted === 0 ? (
                  <Alert onClose={handleCloseSnack} severity="success" sx={{ width: "100%" }}>
                    Added to Favourites!
                  </Alert>
                ) : (
                  <Box>
                    <Alert onClose={handleCloseSnack} severity="error" sx={{ width: "100%" }}>
                      Deleted from Favourites!
                    </Alert>
                  </Box>
                )}
              </Snackbar>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "row" },
                height: "auto",
                width: "auto",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center" }}>
                <Box sx={{ height: "100%", width: "100%" }}>
                  <img
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "1em",
                      boxShadow: "inherit",
                    }}
                    src={recipe.image}
                  ></img>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingTop: "1vh",
                    paddingBottom: "1vh",
                    overflowX: "auto",
                  }}
                >
                  {!loading &&
                    diets.map((item) => (
                      <Chip sx={{ marginRight: "1vh" }} key={item} variant="outlined" label={item}></Chip>
                    ))}
                </Box>
              </Box>

              <Box
                sx={{
                  paddingLeft: "2vh",
                  paddingTop: "0px",
                  overflowX: "auto",
                  width: "100%",
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column", md: "column", lg: "column" },
                }}
              >
                <Demo sx={{ display: "flex", flexDirection: { xs: "row", sm: "column", md: "column", lg: "column" } }}>
                  <List
                    sx={{ display: "flex", flexDirection: { xs: "row", sm: "column", md: "column", lg: "column" } }}
                  >
                    {!loading &&
                      recipe.nutrition.nutrients
                        .filter(
                          (nutrient) =>
                            nutrient.name === "Calories" ||
                            nutrient.name === "Protein" ||
                            nutrient.name === "Carbohydrates" ||
                            nutrient.name === "Saturated Fat" ||
                            nutrient.name === "Fat" ||
                            nutrient.name === "Sugar"
                        )
                        .map((item) => (
                          <ListItem key={item.name}>
                            <ListItemText primary={item.name} secondary={`${item.amount} ${item.unit}`} sx={{}} />
                          </ListItem>
                        ))}
                  </List>
                </Demo>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              padding: "2vh",
              display: "flex",
              width: { xs: "100%" },
              flexGrow: 1,
              flexDirection: { xs: "column", sm: "row" },
              height: "70vh",
              borderRadius: "1em",
              borderColor: "#eaeaea",
              borderWidth: "1vh",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: { xs: "100%", sm: "45%", md: "25%" },
                marginLeft: "1vh",
                flexDirection: "column",
                backgroundColor: "#eaeaea",
                borderRadius: "1em",
              }}
            >
              <Box sx={{ marginLeft: "1vh" }}>
                <Typography variant="h4">Ingredients</Typography>
              </Box>
              <Box sx={{ overflowY: "auto" }}>
                <List>
                  {!loading &&
                    ingredients.map((item) => (
                      <ListItem sx={{ padding: "1vh" }} key={item.id}>
                        <ListItemText primary={item.name} secondary={`${item.amount} ${item.unit}`}></ListItemText>
                      </ListItem>
                    ))}
                </List>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "70%",
              }}
            >
              <Box sx={{ marginLeft: "1.5vh" }}>
                <Typography sx={{}} variant="h4">
                  Method
                </Typography>
              </Box>
              <Box
                sx={{
                  overflowY: "auto",
                }}
              >
                <List>
                  {!loading &&
                    method.map((item) => (
                      <ListItem key={item.number}>
                        <ListItemText primary={`${item.number}. ${item.step}`}></ListItemText>
                      </ListItem>
                    ))}
                </List>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: " flex", flexDirection: "column" }}>
          <Stack spacing={1}>
            <Box sx={{ padding: "2vh" }}>
              <Skeleton animation="wave" variant="text" sx={{ fontSize: "5rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", padding: "2vh" }}>
              <Box>
                <Skeleton animation="wave" variant="rectangular" width={"60vh"} height={"50vh"} />
              </Box>
              <Box sx={{ marginLeft: "2vh" }}>
                <Skeleton animation="wave" variant="rounded" width={"5vh"} height={"50vh"} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box sx={{ marginLeft: "2vh" }}>
                <Skeleton animation="wave" width={"30vh"} variant="text" sx={{ fontSize: "5rem" }} />
                <Skeleton animation="wave" width={"30vh"} variant="text" sx={{ fontSize: "2rem" }} />
                <Skeleton animation="wave" width={"30vh"} variant="text" sx={{ fontSize: "2rem" }} />
                <Skeleton animation="wave" width={"30vh"} variant="text" sx={{ fontSize: "2rem" }} />
                <Skeleton animation="wave" width={"30vh"} variant="text" sx={{ fontSize: "2rem" }} />
              </Box>
              <Box sx={{ marginLeft: "2vh" }}>
                <Skeleton animation="wave" width={"90vh"} variant="text" sx={{ fontSize: "5rem" }} />
                <Skeleton animation="wave" width={"90vh"} variant="text" sx={{ fontSize: "2rem" }} />
                <Skeleton animation="wave" width={"90vh"} variant="text" sx={{ fontSize: "2rem" }} />
                <Skeleton animation="wave" width={"90vh"} variant="text" sx={{ fontSize: "2rem" }} />
                <Skeleton animation="wave" width={"90vh"} variant="text" sx={{ fontSize: "2rem" }} />
              </Box>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Recipe;
