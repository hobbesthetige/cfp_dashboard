import { useEventsSocket } from "@/contexts/eventsSocketContext";
import { Add } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AddEventDialog from "./addEventDialog";
import EditEventDialog from "./editEventDialog";
import EventListItem from "./eventListItem";
import EventsFilterSelect from "./filterEvents";

export enum EventLogLevel {
  Info = "Info",
  Warning = "Warning",
  Alert = "Alert",
  Error = "Error",
}

export interface EventLog {
  id: string;
  category: string;
  title: string;
  message: string;
  isUserGenerated: boolean;
  timestamp: string;
  author: string;
  level: EventLogLevel;
  lastUpdated: string;
}

export default function EventList() {
  const { eventsSocket } = useEventsSocket();
  const [events, setEvents] = useState<EventLog[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventLog | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLogLevels, setSelectedLogLevels] = useState<EventLogLevel[]>(
    []
  );

  const filteredEvents = events.filter((event) => {
    if (selectedCategories.length === 0 && selectedLogLevels.length === 0) {
      return true;
    }

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category);
    const levelMatch =
      selectedLogLevels.length === 0 || selectedLogLevels.includes(event.level);

    return categoryMatch && levelMatch;
  });

  const uniqueCategories = [
    ...new Set(events.map((event) => event.category)),
  ].sort();

  const uniqueLogLevels = [
    ...new Set(events.map((event) => event.level)),
  ] as EventLogLevel[];

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

  const handleLogLevelsChange = useCallback((newLogLevels: EventLogLevel[]) => {
    console.log("Selected log levels:", newLogLevels);
    setSelectedLogLevels(newLogLevels);
  }, []);

  useEffect(() => {
    if (eventsSocket) {
      eventsSocket.on("eventItems", (eventItems) => setEvents(eventItems));
      eventsSocket.on("newEventItem", addEvent);
      eventsSocket.on("updateEventItem", handleUpdateEventItem);
      eventsSocket.on("deleteEventItem", deleteEvent);
      eventsSocket.emit("eventItems");
      return () => {
        eventsSocket.off("eventItems", (eventItems) => setEvents(eventItems));
        eventsSocket.off("newEventItem", addEvent);
        eventsSocket.off("updateEventItem", handleUpdateEventItem);
        eventsSocket.off("deleteEventItem", deleteEvent);
      };
    }
  }, [eventsSocket, addEvent, handleUpdateEventItem, deleteEvent]);

  const filteredEventsCount = filteredEvents.length;
  const eventsLabel =
    selectedCategories.length > 0 || selectedLogLevels.length > 0
      ? "Filtered Event" + (filteredEventsCount === 1 ? "" : "s")
      : "Event" + (events.length === 1 ? "" : "s");

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
          {filteredEventsCount} {eventsLabel}
        </Typography>
        <Stack direction="row" alignItems="center">
          <EventsFilterSelect
            categories={uniqueCategories}
            logLevels={uniqueLogLevels}
            handleCategoriesChange={handleCategoriesChange}
            handleLogLevelsChange={handleLogLevelsChange}
          />
          <IconButton onClick={handleOpenAddDialog}>
            <Add />
          </IconButton>
        </Stack>
      </Stack>

      <List>
        {filteredEvents.map((event, index) => (
          <React.Fragment key={`${event.id}/${index}`}>
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
