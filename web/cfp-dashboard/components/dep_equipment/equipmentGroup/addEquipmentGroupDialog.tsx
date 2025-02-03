import {
  EquipmentGroup,
  EquipmentService,
  JobControlNumber,
} from "@/app/types/equipment";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

interface AddEquipmentGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: EquipmentGroup) => void;
}

const defaultService: EquipmentService = {
  enclave: "",
  serviceName: "",
  id: uuidv4(),
  isVisible: true,
  status: "Offline",
  statusColor: "error",
  notes: "",
  autoUpdatePingAddress: "",
  lastUpdated: new Date().toISOString(),
  history: [],
};

const AddEquipmentGroupDialog: React.FC<AddEquipmentGroupDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const created = new Date().toISOString();
  const [errors, setErrors] = useState({ groupName: false });
  const [groupName, setGroupName] = useState("");
  const [utc, setUtc] = useState("");
  const [jobControlNumber, setJobControlNumber] = useState<JobControlNumber>({
    number: "",
    type: "Installation",
    timestamp: created,
  });
  const [services, setServices] = useState<EquipmentService[]>([]);
  const [newService, setNewService] =
    useState<EquipmentService>(defaultService);

  const handleSave = () => {
    const hasError = groupName.trim() === "";
    setErrors({ groupName: hasError });

    if (hasError) {
      return;
    }

    const jobControlNumbers: JobControlNumber[] = [];
    if (jobControlNumber.number.trim() !== "") {
      jobControlNumbers.push(jobControlNumber);
    }

    const newGroup: EquipmentGroup = {
      id: uuidv4(),
      name: groupName,
      utc,
      jobControlNumbers,
      created,
      equipment: [],
      services,
    };

    onSave(newGroup);
    onClose();
  };

  React.useEffect(() => {
    setGroupName("");
    setUtc("");
    setJobControlNumber({
      number: "",
      type: "Installation",
      timestamp: new Date().toISOString(),
    });
    setErrors({ groupName: false });
    setServices([]);
  }, [open]);

  const handleAddService = () => {
    if (newService.enclave && newService.serviceName) {
      setServices(
        [...services, newService].sort((a, b) => {
          if (a.enclave === b.enclave) {
            return a.serviceName.localeCompare(b.serviceName);
          }
          return a.enclave.localeCompare(b.enclave);
        })
      );
      setNewService(defaultService);
    }
  };

  const handleDeleteService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Equipment Group</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          required
          error={errors.groupName}
          helperText={errors.groupName ? "Name is required" : ""}
        />
        <TextField
          label="UTC"
          value={utc}
          onChange={(e) => setUtc(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }}>
          <Autocomplete
            disablePortal
            options={["Installation", "Maintenance", "Repair"]}
            sx={{ width: "50%" }}
            value={jobControlNumber.type}
            renderInput={(params) => <TextField {...params} label="JCN Type" />}
            onChange={(event, value) =>
              setJobControlNumber({
                ...jobControlNumber,
                number: jobControlNumber?.number || "",
                type: value || "",
              })
            }
          />
          <TextField
            label="JCN Number"
            value={jobControlNumber.number}
            onChange={(e) =>
              setJobControlNumber({
                ...jobControlNumber,
                number: e.target.value,
                type: jobControlNumber?.type || "",
              })
            }
            sx={{ width: "50%" }}
            variant="outlined"
            margin="normal"
            component="span"
          />
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h6" component="div">
          Services Provided
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            disablePortal
            sx={{ width: "100%" }}
            options={["NIPR", "SIPR", "JWICS", "NSANET", "COALITION", "Other"]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enclave"
                variant="outlined"
                margin="normal"
              />
            )}
            value={newService.enclave}
            onChange={(event, value) =>
              setNewService({ ...newService, enclave: value || "" })
            }
          />
          <Autocomplete
            disablePortal
            sx={{ width: "100%" }}
            options={[
              "Data",
              "Voice",
              "Firewall",
              "Call Server",
              "Email Server",
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Service"
                variant="outlined"
                margin="normal"
              />
            )}
            value={newService.serviceName}
            onChange={(event, value) =>
              setNewService({ ...newService, serviceName: value || "" })
            }
          />
          <IconButton color="primary" onClick={handleAddService}>
            <Add />
          </IconButton>
        </Stack>
        <List>
          {services.map((service, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${service.enclave} - ${service.serviceName}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteService(index)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentGroupDialog;
