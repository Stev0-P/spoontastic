import React from "react";
import { Box } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Button, colors, Grow, ImageList, ImageListItem } from "@mui/material";
import ListItemButton from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useHistory, useLocation } from "react-router-dom";
import useTime from "../hooks/useTime";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import UserContext from "../context/User";
import { yellow } from "@mui/material/colors";
import { set } from "mongoose";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: "white",
}));

const RecipeList = (props) => {
  const [dense, setDense] = useState(false);
  const time = useTime();
  const history = useHistory();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourited, setFavourited] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [favouriteIDs, setFavId] = useState([]);
  const [color, setColor] = useState("");
  const [clickID, setID] = useState(0);
  const [noMatch, setNotMatched] = useState(false);
  const activeUser = useContext(UserContext);
  const [deleted, setDeleted] = useState(0);

  // const userId = "6311ec11144a00d89b6cf1c4";

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: response } = await axios.get("/api/recipes/", {
          params: {
            mealType: time.type,
            userDiet: activeUser.diet,
            userIntolerances: activeUser.intolerance,
          },
        });

        setRecipes(response);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [time.type]);

  const fetchFavourites = async () => {
    try {
      const { data: response } = await axios.get(`/api/favourites/${activeUser.userId}`);
      setFavourites(response.recipe);
      setNotMatched(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const onFavourite = (item) => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/favourites/", {
          title: item.title,
          image: item.image,
          creator: activeUser.userId,
          recipeID: item.id,
        });
        setFavourited(true);
        await fetchFavourites();
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  const onDelete = (item) => {
    const itemID = item.id;
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete(`/api/favourites/delete/${itemID}`);
        setDeleted((prevState) => prevState + 1);
        setFavourited(false);
        await fetchFavourites();
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  const matchIDs = (item) => {
    if (favourites.find((fav) => fav.recipeID === `${item.id}`)) {
      return true;
    }
    // console.log("matches if fav exists" + item.id);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f7a05e",
        borderRadius: "1em",
        margin: 2,
      }}
    >
      <Typography sx={{ mt: 4, mb: 2, marginLeft: 1, marginTop: 1 }} variant="h6" component="div">
        {props.label} {`${props.label === "Recommended" ? time.text : ""}`}
      </Typography>
      <Demo sx={{ borderRadius: "1em" }}>
        <List dense={dense}>
          {!loading &&
            recipes.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  backgroundColor: "#f5efe9",
                  borderRadius: "1em",
                  marginTop: 1,
                  boxShadow: 2,
                }}
                disablePadding
              >
                <img
                  style={{
                    height: "125px",
                    width: "150px",
                    borderBottomLeftRadius: "1em",
                    borderTopLeftRadius: "1em",
                  }}
                  src={`${item.image}`}
                ></img>

                <ListItemText
                  onClick={() => history.push(`/recipe/${item.id}`)}
                  primary={item.title}
                  sx={{
                    margin: 4,
                    height: "3em",
                    backgroundColor: "#FAFAF9",
                    borderRadius: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: "2em",
                  }}
                />
                <IconButton
                  size="large"
                  sx={{ marginRight: 3 }}
                  selected={favourited}
                  color={matchIDs(item) ? "warning" : "default"}
                  onClick={() => {
                    !matchIDs(item) ? onFavourite(item) : onDelete(item);
                  }}
                >
                  {" "}
                  <StarIcon fontSize="large" />{" "}
                </IconButton>
              </ListItem>
            ))}
        </List>
      </Demo>
    </Box>
  );
};

export default RecipeList;
