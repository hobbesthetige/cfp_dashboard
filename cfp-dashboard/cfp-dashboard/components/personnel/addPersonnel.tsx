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

interface AddPersonnelProps {
  open: boolean;
  onClose: () => void;
  onSave: (personnel: Personnel) => void;
}

const AddPersonnel: React.FC<AddPersonnelProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const newPersonnel: Personnel = {
    id: new Date().toISOString(),
    firstName: "",
    lastName: "",
    rank: "",
    dutyPosition: "",
    unit: "263rd CBCS",
    phone: "",
    email: "",
  };
  const [personnel, setPersonnel] = useState<Personnel>(newPersonnel);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonnel((prevPersonnel) => ({
      ...prevPersonnel,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(personnel);
    setPersonnel(newPersonnel);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Personnel</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            select
            name="rank"
            label="Rank"
            value={personnel.rank}
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
            value={personnel.firstName}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={personnel.lastName}
            onChange={handleInputChange}
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            name="dutyPosition"
            label="Duty Position"
            value={personnel.dutyPosition}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="unit"
            label="Unit"
            value={personnel.unit}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            name="phone"
            label="Phone"
            value={personnel.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={personnel.email}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPersonnel;
