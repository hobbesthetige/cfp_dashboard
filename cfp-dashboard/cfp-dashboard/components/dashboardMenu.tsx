import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  ListItemIcon, // Import the Button component
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/authContext";
import { Dashboard, Inventory } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import FPCONDialog from "./fpcon/FPCONDialog";

const DashboardMenu: React.FC<{
  open: boolean;
  setOpen(value: boolean): void;
}> = ({ open, setOpen }) => {
  const drawerWidth = 240;
  const { logout } = useAuth();
  const router = useRouter();

  const handlePath = (path: string) => {
    router.push(path);
  };

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
                <ListItemButton onClick={() => handlePath("/dashboard")}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handlePath("/equipment")}>
                  <ListItemIcon>
                    <Inventory />
                  </ListItemIcon>
                  <ListItemText primary="Equipment" />
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
