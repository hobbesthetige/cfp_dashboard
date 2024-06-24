"use client";
import React, { use, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  CssBaseline,
  Divider,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import withAuth from "@/components/withAuth";
import DashboardMenu from "@/components/dashboardMenu";
import { decl } from "postcss";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import PacePlanBanner from "@/components/pacePlan/pacePlanBanner";
import { SocketProvider } from "@/contexts/socketContext";
import EventList from "@/components/events/eventsList";
import { Socket } from "socket.io-client";
import TimeBanner from "@/components/time/timeBanner";
import EquipmentList from "@/components/equipment/equipmentList";
import ServicesBanner from "@/components/services/servicesBanner";
import { useTitle } from "@/contexts/titleProvider";
import LocationsList from "@/components/personnel/locationsList";

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
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <TimeBanner />
        <SocketProvider namespace="pacePlan">
          <PacePlanBanner />
        </SocketProvider>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box sx={{ flexShrink: 0, mr: 3, mt: 3 }}>
          <EventList />
        </Box>
        <Box sx={{ flexGrow: 1, mt: 3 }}>
          <SocketProvider namespace="equipmentGroups">
            <ServicesBanner />
          </SocketProvider>
          <SocketProvider namespace="personnelLocations">
            <LocationsList />
          </SocketProvider>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(MyComponent);
