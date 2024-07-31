import { EquipmentGroup } from "@/app/types/equipment";
import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";

interface PacePlanLetterProps {
  groups: EquipmentGroup[];
  letter: string;
  equipmentName: string;
  equipmentID: string | undefined;
  isActive: boolean;
  color: string;
  handleChange: (
    isActive: boolean,
    equipmentName: string,
    equipmentID: string | undefined
  ) => void;
}

const PacePlanLetter: React.FC<PacePlanLetterProps> = (props) => {
  const color = props.isActive ? props.color : "grey";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("Dialog open state changed:", open);
  }, [open]);

  const handleOpen = () => {
    console.log("Opening dialog");
    setOpen(true);
  };

  const handleClose = () => {
    console.log("Closing dialog");
    setOpen(false);
  };

  const DialogComponent: React.FC = () => {
    const [newEquipmentName, setNewEquipmentName] = useState(
      props.equipmentName
    );
    const [newEquipmentID, setNewEquipmentID] = useState(props.equipmentID);
    const [isActive, setIsActive] = useState(props.isActive);

    const updateGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
      const groupID = event.target.value;
      const group = props.groups.find((group) => group.id === groupID);
      if (group) {
        setNewEquipmentID(group.id);
        setNewEquipmentName(group.name);
      }
    };

    const handleSave = () => {
      props.handleChange(isActive, newEquipmentName, newEquipmentID);
      handleClose();
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Equipment</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Equipment Group"
            value={newEquipmentID}
            onChange={updateGroup}
            fullWidth
            margin="normal"
          >
            {props.groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
            }
            label="Is Active"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <Avatar
        sx={{ width: 100, height: 100, bgcolor: color }}
        onClick={handleOpen}
      >
        <Typography variant="h1">{props.letter}</Typography>
      </Avatar>
      {props.equipmentID ? (
        <Typography variant="h4" onClick={handleOpen}>
          {props.equipmentName}
        </Typography>
      ) : (
        <Typography variant="h4" onClick={handleOpen}>
          {"-"}
        </Typography>
      )}
      <DialogComponent />
    </Stack>
  );
};

export default PacePlanLetter;
