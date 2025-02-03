import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { EquipmentGroup, makeEquipmentGroup } from "../types/equipment";

interface AddEquipmentGroupDialogProps {
  open: boolean;
  handleClose: () => void;
  handleAdd: (equipmentGroup: EquipmentGroup) => void;
}
const AddEquipmentGroupDialog: React.FC<AddEquipmentGroupDialogProps> = ({
  open,
  handleClose,
  handleAdd,
}) => {
  const [equipmentGroup, setEquipmentGroup] = useState<EquipmentGroup>(
    makeEquipmentGroup()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEquipmentGroup((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Add Equipment Group</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="outlined" onClick={() => handleAdd(equipmentGroup)}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentGroupDialog;
