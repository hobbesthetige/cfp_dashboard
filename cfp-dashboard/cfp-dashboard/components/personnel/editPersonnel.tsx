import { Personnel, personnelRanks } from "@/app/types/personnel";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stack,
  MenuItem,
} from "@mui/material";

interface EditPersonnelProps {
  personnel: Personnel;
  open: boolean;
  onClose: () => void;
  onSave: (personnel: Personnel) => void;
}

const EditPersonnel: React.FC<EditPersonnelProps> = ({
  personnel,
  open,
  onClose,
  onSave,
}) => {
  const [updatedPersonnel, setUpdatedPersonnel] =
    useState<Personnel>(personnel);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedPersonnel((prevPersonnel) => ({
      ...prevPersonnel,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(updatedPersonnel);
    setUpdatedPersonnel(updatedPersonnel);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Personnel</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            select
            name="rank"
            label="Rank"
            value={updatedPersonnel.rank}
            onChange={handleInputChange}
            margin="normal"
            sx={{ minWidth: 100 }}
          >
            {personnelRanks.map((rank) => (
              <MenuItem key={rank.title} value={rank.title}>
                {rank.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="firstName"
            label="First Name"
            value={updatedPersonnel.firstName}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={updatedPersonnel.lastName}
            onChange={handleInputChange}
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            name="dutyPosition"
            label="Duty Position"
            value={updatedPersonnel.dutyPosition}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="unit"
            label="Unit"
            value={updatedPersonnel.unit}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            name="phone"
            label="Phone"
            value={updatedPersonnel.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={updatedPersonnel.email}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPersonnel;
