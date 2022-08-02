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
import { Grow, ImageList, ImageListItem } from "@mui/material";
import ListItemButton from "@mui/material";

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: "white" ,
}));


const itemsList = [
    {
      description: "Pizza",
      img: 'https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80',
      route: '/recipe:id'
    },
    {
      description: "Buffalo Wings",
      img: "https://img.freepik.com/free-photo/delicious-fried-chicken-plate_144627-27379.jpg?t=st=1659444439~exp=1659445039~hmac=c5ed5f3cda87a715afd6430bd6132bf1c0a85569b58728b5d39229e69dcd0318",
      route: '/recipe:id'
      
    },
    {
      description: "Rizzoto Pasta",
      img: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?&t=st=1659444485~exp=1659445085~hmac=aa7de2e42b79825cc04bf17eec6c034db604757b465907c0c0a5ebc5df72d11a",
      route: '/recipe:id'
      
    },
]

const RecipeList = () => {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f7a05e', borderRadius: "1em", margin: 2 }}>
      <Typography sx={{ mt: 4, mb: 2, marginLeft: 1 }} variant="h6" component="div">
        Recommended
      </Typography>
      <Demo sx={{borderRadius: "1em"}}>
        <List dense={dense} sx={{}}>
        {itemsList.map((item) => (
            <ListItem key={item.description} sx={{backgroundColor: '#f5efe9', borderRadius: "1em", marginTop: 1, boxShadow: 2 }} disablePadding>
             
                 <img  style={{ height: '125px', width: '150px', borderBottomLeftRadius: '1em', borderTopLeftRadius: '1em'}}src={`${item.img}`}></img>
              
                <ListItemText primary={item.description}  sx={{marginLeft: 1}}/>

                <IconButton></IconButton>
                
            </ListItem>
            
          ))}
        </List>
      </Demo>
    </Box>
  );
};

export default RecipeList;
