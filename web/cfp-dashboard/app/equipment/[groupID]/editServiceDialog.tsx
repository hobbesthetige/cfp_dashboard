import { EquipmentService } from "@/app/types/equipment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import exp from "constants";
import { useState } from "react";

const EditServiceDialog: React.FC<{
  service: EquipmentService;
  open: boolean;
  handleClose: () => void;
  handleUpdate: (service: EquipmentService) => void;
  handleDelete: (service: EquipmentService) => void;
}> = ({ service, open, handleClose, handleUpdate, handleDelete }) => {
  const [editingService, setEditingService] =
    useState<EquipmentService>(service);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingService((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSave = () => {
    handleUpdate(editingService);
  };

  const onDelete = () => {
    handleDelete(editingService);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
      }}
    >
      <DialogTitle>Equipment Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          name="serviceName"
          label="Service Name"
          value={editingService.serviceName}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
          variant="standard"
        />
        <TextField
          name="enclave"
          label="Enclave"
          value={editingService.enclave}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
          variant="standard"
        />
        <TextField
          name="notes"
          label="Notes"
          value={editingService.notes}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions sx={{ pl: 2, pr: 2 }}>
        <Button onClick={onDelete} color="error" variant="outlined">
          Delete
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button onClick={onSave} variant="outlined">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditServiceDialog;
