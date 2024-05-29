import { Box, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const TimeBanner: React.FC = () => {
  function formatZuluTime(date: Date): string {
    return date.toISOString().slice(11, 16);
  }
  function formatLocalTime(date: Date): string {
    return date
      .toLocaleTimeString("en-US", {
        hour12: false,
      })
      .slice(0, 5);
  }
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fade, setFade] = useState(true);
  const [swapped, setSwapped] = useState(false);
  const toggleSwapped = () => setSwapped((prevState) => !prevState);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTime(new Date());
        setFade(true);
      }, 500); // Half of the interval time for fade-out and fade-in
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const ZuluTimeComponent = () => (
    <Box>
      <Typography variant="h1">
        {formatZuluTime(currentTime).slice(0, 2)}
        {
          <Typography
            variant="h1"
            component="span"
            sx={{
              transition: "opacity 1s linear",
              opacity: fade ? 1 : 0,
            }}
          >
            {fade ? ":" : " "}
          </Typography>
        }
        {formatZuluTime(currentTime).slice(3, 5)}{" "}
        <Typography variant="h4" color={"secondary"} component="span">
          Zulu
        </Typography>
      </Typography>
      <Typography variant="h4">
        {formatLocalTime(currentTime)}{" "}
        <Typography variant="h6" color={"secondary"} component="span">
          Local
        </Typography>
      </Typography>
    </Box>
  );
  // const ZuluTimeComponent = () => <Box>Bobby</Box>;

  const LocalTimeComponent = () => (
    <Box>
      <Typography variant="h1">
        {formatLocalTime(currentTime).slice(0, 2)}
        {
          <Typography
            variant="h1"
            component="span"
            sx={{
              transition: "opacity 1s linear",
              opacity: fade ? 1 : 0,
            }}
          >
            {fade ? ":" : " "}
          </Typography>
        }
        {formatLocalTime(currentTime).slice(3, 5)}{" "}
        <Typography variant="h4" color={"secondary"} component="span">
          Local
        </Typography>
      </Typography>
      <Typography variant="h4">
        {formatZuluTime(currentTime)}{" "}
        <Typography variant="h6" color={"secondary"} component="span">
          Zulu
        </Typography>
      </Typography>
    </Box>
  );
  // const LocalTimeComponent = () => <Box>Jefferey</Box>;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 450,
        minWidth: 350,
        bgcolor: "background.paper",
      }}
      textAlign={"center"}
      onClick={toggleSwapped}
    >
      {swapped ? <LocalTimeComponent /> : <ZuluTimeComponent />}
    </Box>
  );
};

export default TimeBanner;
