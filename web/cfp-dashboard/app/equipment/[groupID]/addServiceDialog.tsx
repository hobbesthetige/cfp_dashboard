import { EquipmentService, makeEquipmentService } from "@/app/types/equipment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import exp from "constants";
import { useState, useEffect } from "react";

const AddServiceDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleAdd: (service: EquipmentService) => void;
}> = ({ open, handleClose, handleAdd }) => {
  const [service, setService] = useState<EquipmentService>(
    makeEquipmentService()
  );

  const handleReset = () => {
    setService(makeEquipmentService());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setService((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    handleReset();
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Equipment Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          name="serviceName"
          value={service.serviceName}
          label="Service Name"
          margin="normal"
          fullWidth
          variant="standard"
          onChange={handleInputChange}
        />
        <TextField
          name="enclave"
          label="Enclave"
          margin="normal"
          value={service.enclave}
          fullWidth
          variant="standard"
          onChange={handleInputChange}
        />
        <TextField
          name="notes"
          label="Notes"
          margin="normal"
          value={service.notes}
          fullWidth
          variant="standard"
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button
          autoFocus
          variant="outlined"
          color="primary"
          onClick={() => {
            handleAdd(service);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;
