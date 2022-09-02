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
  const activeUser = useContext(UserContext);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: response } = await axios.get("/api/recipes/", {
          params: {
            mealType: "breakfast", //temp - activeUser.type
            userDiet: "vegan", //temp - activeUser.diet
            userIntolerances: "egg,shellfish", //temp - activeUser.intolerances
          },
        });
        console.log(response)
        setRecipes(response);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [time.type]);

  const onFavourite = (item) => {
    const fetchApi = async () => {
      try {
        console.log(item.id)
        const { data: response } = await axios.post("/api/favourites/", {
          title: item.title,
          image: item.image,
          creator: "6310a2f0e5bf1368fe59bd35", //temp - activeUser.userId
          recipeID: item.id,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  }

  const onDelete = (item) => {
    const fetchApi = async () => {
      try {
        console.log(item.title);
        const { data: response } = await axios.delete(`/api/favourites/delete/${item.id}`);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
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
        {props.label} {`${props.label === "Recomended" ? time.text : ""}`}
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

                {location.pathname === "/favourites" ? (
                  <Box sx={{ marginRight: 3, fontSize: "3em" }}>
                    <Button color="warning" variant="outlined" onClick={() => {onDelete(item)}}>
                      Delete
                    </Button>{" "}
                  </Box>
                ) : (
                  <IconButton size="large" sx={{ marginRight: 3 }} selected={favourited} onClick={() => {onFavourite(item)}}>
                    {" "}
                    <StarIcon fontSize="large"/>{" "}
                  </IconButton>
                )}
              </ListItem>
            ))}
        </List>
      </Demo>
    </Box>
  );
};

export default RecipeList;
