import React from "react";
import { Avatar, Box, Button, ListItemAvatar, makeStyles } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { deepOrange } from "@mui/material/colors";
import { useHistory } from "react-router-dom";

const drawerWidth = 125;



const DrawerNav = () => {

const history = useHistory();


  const itemsList = [
    {
      text: "Dashboard",
      route: "/dashboard"
    },
    {
      text: "Search",
      route: "/search"
      
    },
    {
      text: "Favourites",
      route: "/favourites"
      
    },
  ]


  return (
    <Box sx={{display: 'flex'}}>
    <Drawer 
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
      },
    }}
    variant="permanent" anchor="left">
      <Box sx={{display: 'flex', flexDirection:'column', justifyContent: 'space-between', height: '100%'}}>
        <Box>
        <List>
          <Avatar sx={{ margin: "auto", width: 55, height: 55 , bgcolor: deepOrange[500] }}>SP</Avatar>
          <ListItem>
          <Button variant="contained" onClick={()=> history.push("/account")}>Account</Button>
          </ListItem>
        </List>
        <Divider />
        <List>
          {itemsList.map(({text, route}, index) => (
            <ListItem key={index}  disablePadding>
              <ListItemButton onClick={() => history.push(route)}>
                <ListItemText primary={text}  />
              </ListItemButton>
            </ListItem>
            
          ))}
        </List>
        </Box>
  
        <Button variant="outlined" color="error" sx={{margin: 1}}>
          Log Out
        </Button>
      </Box>
    </Drawer>
    </Box>
  );
};

export default DrawerNav;
