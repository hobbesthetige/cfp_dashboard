"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  CssBaseline,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import withAuth from "@/components/withAuth";
import DashboardMenu from "@/components/dashboardMenu";
import { decl } from "postcss";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import PacePlanBanner from "@/components/pacePlanBanner";
import { SocketProvider } from "@/contexts/socketContext";
import EventList from "@/components/events/eventsList";
import { Socket } from "socket.io-client";
import { EventsSocketProvider } from "@/contexts/eventsSocketContext";

const theme = createTheme({
  palette: {
    custom: {
      main: grey[100],
      light: grey[100],
      dark: grey[700],
      contrastText: "#000",
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
  }

  interface PaletteOptions {
    custom?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/AppBar" {
  interface AppBarPropsColorOverrides {
    custom: true;
  }
}

const MyComponent: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color="custom"
          elevation={0}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" noWrap component="div">
              CFP Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <DashboardMenu open={open} setOpen={setOpen} />
      <EventsSocketProvider>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <SocketProvider namespace="pacePlan">
            <PacePlanBanner />
          </SocketProvider>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ flexShrink: 0, mr: 3 }}>
              <EventList />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Rhoncus dolor purus non enim praesent elementum facilisis leo
                vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                hendrerit gravida rutrum quisque non tellus. Convallis convallis
                tellus id interdum velit laoreet id donec ultrices. Odio morbi
                quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                adipiscing bibendum est ultricies integer quis. Cursus euismod
                quis viverra nibh cras. Metus vulputate eu scelerisque felis
                imperdiet proin fermentum leo. Mauris commodo quis imperdiet
                massa tincidunt. Cras tincidunt lobortis feugiat vivamus at
                augue. At augue eget arcu dictum varius duis at consectetur
                lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                sapien faucibus et molestie ac.
              </Typography>
              <Typography paragraph>
                Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
                ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
                elementum integer enim neque volutpat ac tincidunt. Ornare
                suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
                volutpat consequat mauris. Elementum eu facilisis sed odio
                morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                tincidunt ornare massa eget egestas purus viverra accumsan in.
                In hendrerit gravida rutrum quisque non tellus orci ac.
                Pellentesque nec nam aliquam sem et tortor. Habitant morbi
                tristique senectus et. Adipiscing elit duis tristique
                sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                eleifend. Commodo viverra maecenas accumsan lacus vel facilisis.
                Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
              </Typography>
            </Box>
          </Box>
        </Box>
      </EventsSocketProvider>
    </Box>
  );
};

export default withAuth(MyComponent);
