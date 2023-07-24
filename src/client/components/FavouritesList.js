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

const FavouritesList = (props) => {
  const [dense, setDense] = useState(false);
  const time = useTime();
  const history = useHistory();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourited, setFavourited] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [recNo, setRecNo] = useState(false);
  const activeUser = useContext(UserContext);
  const userId = "6311ec11144a00d89b6cf1c4";

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // When hooks update if(activeUser.favourites === null) {
        const { data: response } = await axios.get(`/api/favourites/${activeUser.userId}`);
        if (response.recipe.length === 0) {
          setRecNo(false);
          setRecipes([]);
        } else {
          setRecNo(true);
          setRecipes(response.recipe);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [time.type, deleted]);

  const onDelete = (item) => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete(`/api/favourites/delete/${item.recipeID}`);
        setDeleted((prevState) => prevState + 1);
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
        <Typography sx={{ mt: 4, mb: 2, marginLeft: 1, marginTop: 1 }} variant="h6" component="div">
          {recNo === false && (
            <Box
              sx={{
                flexGrow: 1,
                borderRadius: "1em",
                paddingTop: 5,
                textAlign: "center",
              }}
            >
              You currently have no favourite recipes. Add the ones you love to keep them
            </Box>
          )}
        </Typography>
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
                  onClick={() => history.push(`/recipe/${item.recipeID}`)}
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
                <Box sx={{ marginRight: 3, fontSize: "3em" }}>
                  <Button
                    color="warning"
                    variant="outlined"
                    onClick={() => {
                      onDelete(item);
                    }}
                  >
                    Delete
                  </Button>{" "}
                </Box>
              </ListItem>
            ))}
        </List>
      </Demo>
    </Box>
  );
};

export default FavouritesList;
