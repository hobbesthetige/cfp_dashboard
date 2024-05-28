import React, { use, useEffect } from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Stack,
  ListItemText,
} from "@mui/material";
import { EventLog } from "./eventsList";
import { orange, red } from "@mui/material/colors";

interface EventListItemProps {
  event: EventLog;
  onClick: () => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onClick }) => {
  const backgroundColor = {
    Info: "primary",
    Warning: orange[500],
    Error: red[500],
  };

  return (
    <ListItem
      sx={{ alignItems: "flex-start" }}
      onClick={onClick}
      disableGutters
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: backgroundColor[event.level] }}>
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

export default EventListItem;
