import React, { useEffect, useState } from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Stack,
  ListItemText,
} from "@mui/material";
import { EventLog } from "./eventsList";
import { grey, orange, red } from "@mui/material/colors";

interface EventListItemProps {
  event: EventLog;
  onClick: () => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onClick }) => {
  const avatarBackgroundColor = {
    Info: grey[400],
    Warning: orange[500],
    Error: red[500],
  };

  const listBackgroundColor = {
    Info: grey[100],
    Warning: orange[100],
    Error: red[100],
  };

  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    setIsRefresh(true);
    const timeout = setTimeout(() => {
      setIsRefresh(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [event.lastUpdated]);

  const listItemStyle = {
    alignItems: "flex-start",
    bgcolor: isRefresh ? listBackgroundColor[event.level] : null,
    transition: "background-color 0.5s ease",
  };

  return (
    <ListItem sx={listItemStyle} onClick={onClick} disableGutters>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: avatarBackgroundColor[event.level] }}>
          {event.level.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <Stack direction="column">
        <ListItemText primary={`${event.category}: ${event.message}`} />
        <ListItemText secondary={new Date(event.timestamp).toLocaleString()} />
        <ListItemText
          secondary={
            new Date(event.timestamp)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ") + " Zulu"
          }
        />
      </Stack>
    </ListItem>
  );
};

// Use React.memo to memoize the component
export default React.memo(EventListItem, (prevProps, nextProps) => {
  return prevProps.event.lastUpdated === nextProps.event.lastUpdated;
});
