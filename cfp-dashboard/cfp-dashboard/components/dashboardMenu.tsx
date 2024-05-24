import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button, // Import the Button component
} from "@mui/material";
import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/authContext";

const DashboardMenu: React.FC<{
  open: boolean;
  setOpen(value: boolean): void;
}> = ({ open, setOpen }) => {
  const drawerWidth = 240;
  const { logout } = useAuth();
  return (
    <Drawer
      // variant="permanent"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            height: "100%",
            bgcolor: "background.paper",
            flexGrow: 1,
          }}
        >
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Inbox" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Drafts" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
          <Divider />
          <nav aria-label="secondary mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Trash" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#simple-list">
                  <ListItemText primary="Spam" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
          <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <Button
              variant="text"
              color="primary"
              sx={{ width: "100%", pb: 2, pt: 2 }}
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DashboardMenu;
