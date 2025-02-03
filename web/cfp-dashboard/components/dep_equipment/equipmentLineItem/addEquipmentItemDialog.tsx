import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Equipment, EquipmentGroup } from "@/app/types/equipment";

interface AddEquipmentItemDialogProps {
  group: EquipmentGroup;
  open: boolean;
  onClose: () => void;
  onAddEquipment: (equipment: Equipment, group: EquipmentGroup) => void;
}

const AddEquipmentItemDialog: React.FC<AddEquipmentItemDialogProps> = ({
  open,
  onClose,
  group,
  onAddEquipment,
}) => {
  const [equipmentName, setEquipmentName] = useState("");
  const [category, setCategory] = useState("Networking Equipment");
  const [department, setDepartment] = useState("Infrastructure");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [errors, setErrors] = useState({
    equipmentName: false,
    category: false,
    department: false,
    quantity: false,
  });

  const reset = () => {
    setEquipmentName("");
    setCategory("Networking Equipment");
    setDepartment("Infrastructure");
    setQuantity(1);
    setNotes("");
    setSerialNumber("");
    setErrors({
      equipmentName: false,
      category: false,
      department: false,
      quantity: false,
    });
  };

  useEffect(() => {
    reset();
  }, [open]);

  useEffect(() => {
    setErrors({
      equipmentName: equipmentName.trim() === "",
      category: category.trim() === "",
      department: department.trim() === "",
      quantity: quantity <= 0,
    });
  }, [equipmentName, category, department, quantity]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleSerialNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSerialNumber(event.target.value);
  };

  const handleEquipmentNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEquipmentName(event.target.value);
  };

  const handleAddEquipment = () => {
    if (
      errors.equipmentName ||
      errors.category ||
      errors.department ||
      errors.quantity
    ) {
      return;
    }
    const lastUpdated = new Date().toISOString();
    const id = new Date().toISOString();
    const equipment: Equipment = {
      id: id,
      name: equipmentName,
      category,
      department,
      quantity,
      notes,
      serialNumber,
      lastUpdated,
    };

    onAddEquipment(equipment, group);

    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Equipment to {group.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Equipment Name"
          type="text"
          fullWidth
          value={equipmentName}
          onChange={handleEquipmentNameChange}
          required
          error={errors.equipmentName}
          helperText={errors.equipmentName ? "Name is required" : ""}
        />
        <Autocomplete
          disablePortal
          options={[
            "Networking Equipment",
            "SATCOM Equipment",
            "Radios",
            "Computers",
            "Monitors",
            "Other",
          ]}
          fullWidth
          value={category}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Category"
              type="text"
              fullWidth
              value={category}
              required
              error={errors.category}
              helperText={errors.category ? "Category is required" : ""}
            />
          )}
          onChange={(event, value) => {
            setCategory(value || "");
          }}
        />
        <Autocomplete
          disablePortal
          options={["Infrastructure", "SATCOM", "CFP", "Other"]}
          fullWidth
          value={department}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Department"
              type="text"
              fullWidth
              value={department}
              required
              error={errors.department}
              helperText={errors.department ? "Department is required" : ""}
            />
          )}
          onChange={(event, value) => {
            setDepartment(value || "");
          }}
        />
        <TextField
          margin="normal"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={handleQuantityChange}
          required
          error={errors.quantity}
          helperText={errors.quantity ? "Quantity is required" : ""}
        />
        <TextField
          margin="normal"
          label="Serial Number"
          type="text"
          fullWidth
          value={serialNumber}
          onChange={handleSerialNumberChange}
        />
        <TextField
          margin="normal"
          label="Notes"
          type="text"
          fullWidth
          multiline
          value={notes}
          onChange={handleNotesChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddEquipment} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentItemDialog;
