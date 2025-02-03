import { EquipmentGroup } from "@/app/types/equipment";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface PropertiesListProps {
  equipmentGroup: EquipmentGroup;
  setEditingEquipmentGroup: (equipmentGroup: EquipmentGroup) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertiesList: React.FC<PropertiesListProps> = ({
  equipmentGroup,
  setEditingEquipmentGroup,
  handleInputChange,
}) => {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  return (
    <Stack direction={"row"} spacing={2} sx={{ mt: 4 }}>
      <TextField
        name="name"
        label="Equipment Name"
        value={equipmentGroup.name}
        onChange={handleInputChange}
        margin="normal"
        fullWidth
      />
      <TextField
        name="utc"
        label="UTC"
        value={equipmentGroup.utc}
        onChange={handleInputChange}
        margin="normal"
        fullWidth
      />
    </Stack>
  );
};

export default PropertiesList;
