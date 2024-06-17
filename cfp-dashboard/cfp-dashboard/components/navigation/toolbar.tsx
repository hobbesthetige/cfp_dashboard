"use client";
import { ThemeProvider } from "@emotion/react";
import {
  createTheme,
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import DashboardMenu from "../dashboardMenu";
import { useTitle } from "@/contexts/titleProvider";
import { FPCONProvider, useFPCON } from "@/contexts/fpconProvider";
import FPCONDialog from "../fpcon/FPCONDialog";
import FpconSelect from "../fpcon/fpconSelect";

const theme = createTheme({
  palette: {
    custom: {
      main: grey[100],
      light: grey[100],
      dark: grey[700],
      contrastText: "#000",
    },
    lightButton: {
      main: "#FFF",
      light: "#FFF",
      dark: "#FFF",
      contrastText: "#000",
    },
    liteWarning: {
      main: "#F3DCB4",
      light: "#F3DCB4",
      dark: "#F3DCB4",
      contrastText: "#000",
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
    lightButton: Palette["primary"];
    liteWarning: Palette["primary"];
  }

  interface PaletteOptions {
    custom?: PaletteOptions["primary"];
    lightButton?: PaletteOptions["primary"];
    liteWarning?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/AppBar" {
  interface AppBarPropsColorOverrides {
    custom: true;
    liteWarning: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    lightButton: true;
  }
}

const NavigationToolbar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const { title } = useTitle();
  const { fpconState } = useFPCON();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color={fpconState.currentState.color}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              sx={{
                mr: 2,
                color:
                  theme.palette[fpconState.currentState.color].contrastText,
              }}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <FpconSelect />
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <DashboardMenu open={open} setOpen={setOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default NavigationToolbar;
