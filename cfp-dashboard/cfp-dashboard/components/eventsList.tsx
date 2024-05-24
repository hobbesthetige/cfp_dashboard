import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Stack,
  Divider,
} from "@mui/material";
import { useEventsSocket } from "@/contexts/eventsSocketContext";

interface EventLog {
  category: string;
  message: string;
  isUserGenerated: boolean;
}

export default function EventList() {
  const { eventsSocket, isEventsSocketConnected } = useEventsSocket();
  const [events, setEvents] = useState<EventLog[]>([]);

  const handleEventItems = useCallback((eventItems: EventLog[]) => {
    console.log("Received updated event items:", eventItems);
    setEvents(eventItems);
  }, []);

  const handleAddEventItem = useCallback(
    (eventItem: EventLog) => {
      console.log("Received new event item:", eventItem);
      setEvents([eventItem, ...events]);
    },
    [events]
  );

  useEffect(() => {
    if (eventsSocket) {
      eventsSocket.on("eventItems", handleEventItems);
      eventsSocket.on("newEventItem", handleAddEventItem);
      return () => {
        eventsSocket.off("eventItems", handleEventItems);
        eventsSocket.off("newEventItem", handleAddEventItem);
      };
    }
  }, [
    eventsSocket,
    isEventsSocketConnected,
    handleEventItems,
    handleAddEventItem,
  ]);

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Typography variant="h6" component="div">
        Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <React.Fragment key={index}>
            <ListItem sx={{ alignItems: "flex-start" }}>
              <ListItemAvatar>
                <Avatar>{event.isUserGenerated ? "U" : "S"}</Avatar>
              </ListItemAvatar>
              <Stack direction="column">
                <ListItemText primary={`${event.category}: ${event.message}`} />
                <ListItemText secondary={new Date().toLocaleString()} />
                <ListItemText
                  secondary={
                    new Date().toISOString().slice(0, 19).replace("T", " ") +
                    " Zulu"
                  }
                />
              </Stack>
            </ListItem>
            {index !== events.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
