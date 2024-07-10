import { Personnel, PersonnelLocation } from "@/app/types/personnel";
import { SocketProvider, useSocket } from "@/contexts/socketContext";
import useAxios from "@/contexts/useAxios";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Paper,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import React, { useState, useEffect, use, useCallback } from "react";
import EditServicesBanner from "../services/editServicesBanner";
import ServiceStatusIndicator from "../services/serviceStatusIndicator";
import PersonnelChecklistDialog from "./personnelChecklist";
import {
  CheckCircleOutline,
  Edit,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import EditPersonnelLocation from "./editPersonnelLocation";
import {
  formatDateInZuluTime,
  formatTimeInterval,
} from "@/app/utilities/dateFormats";
import { useEventsSocket } from "@/contexts/eventsSocketContext";
import { EventLogLevel } from "../events/eventsList";

function LocationsList() {
  const [editingLocation, setEditingLocation] = useState<PersonnelLocation>();
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [locations, setLocations] = useState<PersonnelLocation[]>([]);
  const { isConnected, socket } = useSocket();
  const axios = useAxios();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { eventsSocket } = useEventsSocket();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        setCurrentTime(new Date());
      }, 500); // Half of the interval time for fade-out and fade-in
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch initial personnel and locations data from the API
    axios.get("/personnel").then((response) => setPersonnel(response.data));
    axios
      .get("/personnel/locations")
      .then((response) => setLocations(response.data));
  }, []);

  useEffect(() => {
    if (!socket) return;
    if (!isConnected) return;

    // Listen for real-time updates from the socket
    socket?.on("locationUpdate", (updatedLocation) => {
      console.log("Got an update");
      setLocations((prevLocations) =>
        prevLocations.map((loc) =>
          loc.personnelId === updatedLocation.personnelId
            ? updatedLocation
            : loc
        )
      );
    });

    socket?.on("addLocation", (newLocation) => {
      setLocations((prevLocations) => [...prevLocations, newLocation]);
    });

    socket?.on("deleteLocation", (removedLocation) => {
      setLocations((prevLocations) =>
        prevLocations.filter(
          (loc) => loc.personnelId !== removedLocation.personnelId
        )
      );
    });

    return () => {
      socket?.off("locationUpdate");
      socket?.off("addLocation");
      socket?.off("deleteLocation");
    };
  }, [socket, isConnected]);

  const handleUpdate = (
    assignedLocation: string,
    currentLocation: string,
    comments: string
  ) => {
    if (!editingLocation) return;
    const updatedLocation = {
      ...editingLocation,
      assignedLocation,
      currentLocation,
      comments,
      lastUpdated: new Date().toISOString(),
    };

    // Emit event
    emitLocationChangedEventItem(editingLocation, updatedLocation);

    // Send update to the server
    axios.post(
      `/personnel/locations/${editingLocation.personnelId}`,
      updatedLocation
    );
  };

  const addPersonnel = async (id: string) => {
    const person = personnel.find((p) => p.id === id);
    if (!person) return;
    const newLocation: PersonnelLocation = {
      personnelId: id,
      personnelName: `${person.rank}. ${person.lastName}, ${person.firstName}`,
      currentLocation: "Onsite",
      assignedLocation: "Onsite",
      comments: "",
      lastUpdated: new Date().toISOString(),
    };

    // Send update to the server
    axios.post(`/personnel/locations/${id}`, newLocation);

    // Emit event
    emitLocationChangedEventItem(null, newLocation);
  };

  const removePersonnel = async (id: string) => {
    // Emit event
    const removedLocation = locations.find((loc) => loc.personnelId === id);
    if (!removedLocation) return;
    emitNotTrackingEventItem(removedLocation);

    // Send update to the server
    axios.delete(`/personnel/locations/${id}`).then(() => {
      // Update local state
      setLocations((prevLocations) =>
        prevLocations.filter((loc) => loc.personnelId !== id)
      );
    });
  };

  const handleEditLocation = (location: PersonnelLocation) => {
    setEditingLocation(location);
  };

  const clearEditLocation = () => {
    setEditingLocation(undefined);
  };

  const emitLocationChangedEventItem = (
    oldLocation: PersonnelLocation | null | undefined,
    newLocation: PersonnelLocation
  ) => {
    if (
      oldLocation &&
      oldLocation.currentLocation === newLocation.currentLocation
    ) {
      return;
    }
    const title = oldLocation
      ? `Location for ${newLocation.personnelName} changed from ${oldLocation.currentLocation} to ${newLocation.currentLocation}`
      : `Location for ${newLocation.personnelName} changed to ${newLocation.currentLocation}`;
    const message = newLocation.comments || "";
    const level = EventLogLevel.Info;

    emitEventItem(level, "Personnel Location", title, message);
  };

  const emitNotTrackingEventItem = (location: PersonnelLocation) => {
    const title = `Stopped tracking location for ${location.personnelName}`;
    const message = location.comments || "";
    const level = EventLogLevel.Info;

    emitEventItem(level, "Personnel Location", title, message);
  };

  function emitEventItem(
    level: EventLogLevel,
    category: string,
    title: string,
    message: string | undefined
  ) {
    eventsSocket?.emit("newEventItem", {
      id: new Date().toISOString(),
      level,
      category,
      title,
      message: message || "",
      author: "User",
      isUserGenerated: true,
      timestamp: new Date().toISOString(),
    });
  }

  const personnelTitle = useCallback(() => {
    return `${locations.length} Personnel, ${
      locations.filter((loc) => loc.currentLocation === "Onsite").length
    } Onsite`;
  }, [locations]);

  return (
    <Box sx={{ flex: 1 }}>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h6">{personnelTitle()}</Typography>
        <PersonnelChecklistDialog
          personnel={personnel}
          selectedIDs={locations.map((loc) => loc.personnelId)}
          addID={addPersonnel}
          removeID={removePersonnel}
        />
        {editingLocation && (
          <EditPersonnelLocation
            name={editingLocation.personnelName}
            location={editingLocation}
            open={Boolean(editingLocation)}
            onUpdate={handleUpdate}
            onClose={clearEditLocation}
          />
        )}
      </Stack>
      <Box sx={{ mt: 0, ml: 0, mr: 2, mb: 4 }}>
        <List>
          {locations.map((loc, index) => (
            <React.Fragment key={loc.personnelId}>
              <ListItem disableGutters disablePadding>
                <ListItemButton onClick={() => handleEditLocation(loc)}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: "100%" }}
                  >
                    <ListItemText
                      primary={loc.personnelName}
                      secondary={loc.comments}
                      sx={{ flex: 1 }} // Add this line
                    />
                    <Stack direction="column" spacing={1} alignItems="center">
                      {loc.currentLocation === loc.assignedLocation ? (
                        <Chip label={loc.currentLocation} color="success" />
                      ) : (
                        <Chip label={loc.currentLocation} color="default" />
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {`${formatTimeInterval(
                          currentTime.getTime() -
                            new Date(loc.lastUpdated).getTime(),
                          false,
                          true,
                          false
                        )}`}
                      </Typography>
                    </Stack>
                  </Stack>
                </ListItemButton>
              </ListItem>
              {index !== locations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default LocationsList;
