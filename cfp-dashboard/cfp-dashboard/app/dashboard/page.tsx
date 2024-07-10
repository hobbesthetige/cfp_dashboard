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
import Scratchpad from "@/components/scratchpad/scratchpad";
import IssuesList from "@/components/issuetracker/issuesList";

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
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <SocketProvider namespace="personnelLocations">
              <LocationsList />
            </SocketProvider>
            <SocketProvider namespace="scratchpad">
              <Scratchpad />
            </SocketProvider>
          </Stack>
          <SocketProvider namespace="issues">
            <IssuesList />
          </SocketProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(MyComponent);
