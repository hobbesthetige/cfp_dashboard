import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import { useEventsSocket } from "@/contexts/eventsSocketContext";
import EditEventDialog from "./editEventDialog";
import { Add } from "@mui/icons-material";
import AddEventDialog from "./addEventDialog";
import EventsFilterSelect from "./filterEvents";
import EventListItem from "./eventListItem";

export enum EventLogLevel {
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
}

export interface EventLog {
  id: string;
  category: string;
  message: string;
  isUserGenerated: boolean;
  timestamp: string;
  author: string;
  level: EventLogLevel;
  lastUpdated: string;
}

export default function EventList() {
  const { eventsSocket, isEventsSocketConnected } = useEventsSocket();
  const [events, setEvents] = useState<EventLog[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventLog | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredEvents = events.filter((event) => {
    if (selectedCategories.length === 0) {
      return true;
    }
    return selectedCategories.includes(event.category);
  });

  const uniqueCategories = [...new Set(events.map((event) => event.category))];

  const handleOpenEditDialog = (event: EventLog) => {
    setSelectedEvent(event);
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedEvent(null);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleSaveEvent = (updatedEvent: EventLog) => {
    const eventWithTimestamp = {
      ...updatedEvent,
      lastUpdated: new Date().toISOString(),
    };
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventWithTimestamp.id ? eventWithTimestamp : event
      )
    );
    eventsSocket?.emit("updateEventItem", eventWithTimestamp);
    handleCloseEditDialog();
  };

  const handleDeleteEvent = (event: EventLog) => {
    handleCloseEditDialog();
    deleteEvent(event);
    eventsSocket?.emit("deleteEventItem", event);
  };

  const deleteEvent = useCallback((event: EventLog) => {
    setEvents((prevEvents) =>
      prevEvents.filter((prevEvent) => prevEvent.id !== event.id)
    );
  }, []);

  const addEvent = useCallback(
    (newEvent: EventLog) => {
      if (!events.some((prevEvent) => prevEvent.id === newEvent.id)) {
        setEvents((prevEvents) =>
          [newEvent, ...prevEvents].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      }
    },
    [events]
  );

  const handleAddEvent = (newEvent: EventLog) => {
    eventsSocket?.emit("newEventItem", newEvent);
    handleCloseAddDialog();
  };

  const handleEventItems = useCallback((eventItems: EventLog[]) => {
    console.log("Received updated event items:", eventItems);
    setEvents(eventItems);
  }, []);

  const handleUpdateEventItem = useCallback((event: EventLog) => {
    setEvents((prevEvents) =>
      prevEvents
        .map((prevEvent) => (prevEvent.id === event.id ? event : prevEvent))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
    );
  }, []);

  const handleCategoriesChange = useCallback((newCategories: string[]) => {
    console.log("Selected categories:", newCategories);
    setSelectedCategories(newCategories);
  }, []);

  useEffect(() => {
    if (eventsSocket) {
      eventsSocket.on("eventItems", handleEventItems);
      eventsSocket.on("newEventItem", addEvent);
      eventsSocket.on("updateEventItem", handleUpdateEventItem);
      eventsSocket.on("deleteEventItem", deleteEvent);
      return () => {
        eventsSocket.off("eventItems", handleEventItems);
        eventsSocket.off("newEventItem", addEvent);
        eventsSocket.off("updateEventItem", handleUpdateEventItem);
        eventsSocket.off("deleteEventItem", deleteEvent);
      };
    }
  }, [
    eventsSocket,
    isEventsSocketConnected,
    handleEventItems,
    addEvent,
    handleUpdateEventItem,
    deleteEvent,
  ]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 450,
        minWidth: 450,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h6" component="div">
          Events
        </Typography>
        <Stack direction="row" alignItems="center">
          <EventsFilterSelect
            categories={uniqueCategories}
            handleCategoriesChange={handleCategoriesChange}
          />
          <IconButton onClick={handleOpenAddDialog}>
            <Add />
          </IconButton>
        </Stack>
      </Stack>

      <List>
        {filteredEvents.map((event, index) => (
          <React.Fragment key={event.id}>
            <EventListItem
              event={event}
              onClick={() => handleOpenEditDialog(event)}
            />
            {index !== events.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      {selectedEvent && (
        <EditEventDialog
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onCancel={handleCloseEditDialog}
        />
      )}
      <AddEventDialog
        open={isAddDialogOpen}
        onSave={handleAddEvent}
        onCancel={handleCloseAddDialog}
      />
    </Box>
  );
}
