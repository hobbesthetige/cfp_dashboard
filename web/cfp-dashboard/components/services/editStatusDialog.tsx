import {
  EquipmentGroup,
  EquipmentService,
  EquipmentServiceStatusHistory,
} from "@/app/types/equipment";
import { formatDateInZuluTime } from "@/app/utilities/dateFormats";
import { useEventsSocket } from "@/contexts/eventsSocketContext";

import useAxios from "@/contexts/useAxios";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { EventLogLevel } from "../events/eventsList";
import EditPingPongDialog from "./editPingPongDialog";
import { useSocket } from "@/contexts/socketContext";

interface EditStatusDialogProps {
  group: EquipmentGroup;
  service: EquipmentService;
  open: boolean;
  onClose: () => void;
}

const EditStatusDialog: React.FC<EditStatusDialogProps> = ({
  group,
  service,
  open,
  onClose,
}) => {
  const [errors, setErrors] = React.useState({ status: false });
  const [statusValue, setStatusValue] = React.useState(service.status);
  const [statusColor, setStatusColor] = React.useState(service.statusColor);
  const [notes, setNotes] = React.useState(service.notes);
  const [pingPong, setPingPong] = React.useState(service.pingPong);
  const axios = useAxios();
  const { socket: pingPongSocket } = useSocket();
  const { eventsSocket } = useEventsSocket();

  const colorCombos: {
    status: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning";
  }[] = [
    { status: "Online", color: "success" },
    { status: "Partially Online", color: "warning" },
    { status: "Degraded Performance", color: "warning" },
    { status: "Intermittent", color: "warning" },
    { status: "In Setup", color: "info" },
    { status: "Offline", color: "error" },
    { status: "Broken", color: "error" },
    { status: "Missing", color: "error" },
    { status: "Unused", color: "default" },
  ];

  const handleStatusChange = (status: string) => {
    setStatusValue(status);
    const color = colorCombos.find((combo) => combo.status === status);
    setStatusColor(color?.color || "default");
  };

  const handleSave = () => {
    const errors = { status: statusValue === "" };
    setErrors(errors);
    if (Object.values(errors).some((error) => error)) {
      return;
    }
    const newHistory: EquipmentServiceStatusHistory = {
      status: service.status,
      notes: service.notes,
      timestamp: service.lastUpdated,
    };
    const history = [newHistory, ...service.history];
    const newService = {
      ...service,
      status: statusValue,
      statusColor,
      notes,
      lastUpdated: new Date().toISOString(),
      pingPong,
      history,
    };

    axios.patch(
      `equipmentGroups/${group.id}/services/${service.id}`,
      newService
    );

    emitEventItem(
      EventLogLevel.Alert,
      `${group.name} ${service.enclave} ${service.serviceName}`,
      `Status updated to **${statusValue}**.`,
      `Previous status: ${service.status}.${notes ? " Notes: " + notes : ""}`
    );
    onClose();
  };

  const handlePingPongSave = (
    hostname: string,
    interval: number,
    timeout: number,
    isAutomaticStatusChange: boolean,
    isActive: boolean
  ) => {
    const newService = {
      ...service,
      pingPong: {
        isActive: isActive,
        hostname: hostname,
        interval: interval,
        timeout: timeout,
        isAutomaticStatusChange: isAutomaticStatusChange,
      },
    };

    console.log("newService", newService);

    setPingPong(newService.pingPong);

    axios.patch(
      `equipmentGroups/${group.id}/services/${service.id}`,
      newService
    );

    console.log("pingPongSocket", isActive, service.id);
    if (isActive) {
      pingPongSocket?.emit("addService", {
        serviceID: service.id,
        pingPong: newService.pingPong,
      });
    } else {
      pingPongSocket?.emit("removeService", service.id);
    }

    emitEventItem(
      EventLogLevel.Alert,
      `${group.name} ${service.enclave} ${service.serviceName}`,
      `Ping Pong setup ${isActive ? "activated" : "deactivated"}.`,
      `Hostname: ${hostname}, Interval: ${interval}, Timeout: ${timeout}, Automatic Status Change: ${isAutomaticStatusChange}`
    );
  };

  function emitEventItem(
    level: EventLogLevel,
    category: string,
    title: string,
    message: string
  ) {
    eventsSocket?.emit("newEventItem", {
      id: new Date().toISOString(),
      level,
      category,
      title,
      message,
      author: "System",
      isUserGenerated: false,
      timestamp: new Date().toISOString(),
    });
  }

  useEffect(() => {
    setErrors({ status: false });
    setStatusValue(service.status);
    setStatusColor(service.statusColor);
    setNotes(service.notes);
  }, [service, open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {`${service.enclave} ${service.serviceName}`} Status
      </DialogTitle>
      <DialogContent sx={{ minHeight: "300px" }}>
        <Autocomplete
          disablePortal
          freeSolo
          options={[
            "Online",
            "Partially Online",
            "Degraded Performance",
            "Intermittent",
            "In Setup",
            "Offline",
            "Broken",
            "Missing",
            "Unused",
          ]}
          fullWidth
          value={service.status}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Category"
              type="text"
              fullWidth
              value={service.status}
              required
              error={errors.status}
              helperText={errors.status ? "Category is required" : ""}
            />
          )}
          onChange={(event, value) => {
            handleStatusChange(value || "");
          }}
        />
        <Chip label={statusValue} color={statusColor} sx={{ mt: 2 }} />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <TextField
          id="service-status-notes"
          label="Notes"
          placeholder="Notes"
          multiline
          fullWidth
          rows={2}
          value={notes}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setNotes(event.target.value)
          }
        />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <FormLabel component="legend">History</FormLabel>
        <List sx={{ minWidth: "350px" }}>
          {service.history.length > 0 ? (
            <>
              {service.history.map(
                (historyItem: EquipmentServiceStatusHistory, index: number) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemText
                        primary={historyItem.status}
                        secondary={historyItem.notes}
                      />
                    </ListItem>
                    <Box sx={{ pl: 2, pb: 2 }}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                      >{`${new Date(
                        historyItem.timestamp
                      ).toLocaleString()}`}</Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component={"div"}
                      >{`${formatDateInZuluTime(
                        new Date(historyItem.timestamp)
                      )}`}</Typography>
                    </Box>
                    <Divider />
                  </Box>
                )
              )}
            </>
          ) : (
            <Typography variant="caption">No history</Typography>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <EditPingPongDialog
          isActive={pingPong?.isActive || false}
          pingPong={pingPong}
          onSave={handlePingPongSave}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditStatusDialog;
