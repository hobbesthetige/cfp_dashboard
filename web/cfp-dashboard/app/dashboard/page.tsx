"use client";
import EventList from "@/components/events/eventsList";
import IssuesList from "@/components/issuetracker/issuesList";
import PacePlanBanner from "@/components/pacePlan/pacePlanBanner";
import LocationsList from "@/components/personnel/locationsList";
import Scratchpad from "@/components/scratchpad/scratchpad";
import ServicesBanner from "@/components/services/servicesBanner";
import TimeBanner from "@/components/time/timeBanner";
import withAuth from "@/components/withAuth";
import { SocketProvider } from "@/contexts/socketContext";
import { useTitle } from "@/contexts/titleProvider";
import { Box, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import React, { useEffect } from "react";

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
