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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface PacePlanLetterProps {
  letter: string;
  equipment: string;
  isActive: boolean;
  color: string;
  handleChange: (isActive: boolean, equipment: string) => void;
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
    const [newEquipment, setNewEquipment] = useState(props.equipment);
    const [isActive, setIsActive] = useState(props.isActive);

    const handleEquipmentChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setNewEquipment(event.target.value);
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Equipment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Equipment"
            type="text"
            value={newEquipment}
            onChange={handleEquipmentChange}
            fullWidth
          />
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              props.handleChange(isActive, newEquipment);
              handleClose();
            }}
          >
            Save
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
      {props.equipment && props.equipment.length > 0 ? (
        <Typography variant="h4" onClick={handleOpen}>
          {props.equipment}
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
