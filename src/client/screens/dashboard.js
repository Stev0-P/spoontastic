import React, { useEffect, useContext } from "react";
import { ListItem, Typography, List, Grid, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import Widget from "../components/Widget";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import useTime from "../hooks/useTime";
import axios from "axios";

const Dashboard = () => {
  const activeUser = useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [recipe, setRecipe] = React.useState({});
  const [diets, setDiets] = React.useState([]);
  const [recommended, setRecommended] = React.useState([{}]);
  const [recsLoading, setRecsLoading] = React.useState(true);

  //Get Random Recipe that User Might Like
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: recipe } = await axios.get("/api/recipes/random/", {
          params: {
            diet: activeUser.diet,
            intolerance: activeUser.intolerance,
            num: "1",
          },
        });

        setLoading(false);
        setRecipe(recipe.recipes[0]);
        setDiets(recipe.recipes[0].diets);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => controller.abort();
  }, []);

  //Get Recommended Recipes
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: response } = await axios.get(`/api/ratings/recs/`);
        setRecsLoading(false);
        setRecommended(response.recommended);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => controller.abort();
  }, [activeUser.userId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginLeft: { xs: "10vh", md: "18vh" },
        paddingBottom: "1vh",
      }}
    >
      <Box sx={{ marginTop: "1.5%" }}>
        {recsLoading === false ? (
          <Typography variant="h4">You Might Like</Typography>
        ) : (
          <Box sx={{ width: "40vh" }}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: "3rem" }} />
          </Box>
        )}
      </Box>
      <Widget recipe={recipe} loading={loading} diets={diets} />
      <Box sx={{ marginTop: "1.5%" }}>
        {recsLoading === false ? (
          <Typography variant="h4">Recommended For You</Typography>
        ) : (
          <Box sx={{ width: "60vh" }}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: "3rem" }} />
          </Box>
        )}
      </Box>
      <Box>
        {recsLoading === false ? (
          <Box sx={{ marginTop: "1.5%" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {recsLoading === false &&
                recommended.map(
                  (item) => (
                    <Grid item key={item.id}>
                      <Widget recipe={item} loading={recsLoading} />
                    </Grid>
                  )

                  //  console.log(item)
                )}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {[...Array(12)].map((_, i) => (
                <Grid item key={i}>
                  <Widget recipe={i} loading={true} diets={i} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
