import React, { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
} from "@mui/material";
import {
  Equipment,
  EquipmentHistoryEntry,
  EquipmentGroup,
} from "@/app/types/equipment";

interface EditEquipmentItemDialogProps {
  group: EquipmentGroup;
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
  onEditEquipment: (equipment: Equipment, group: EquipmentGroup) => void;
  onDeleteEquipment: (equipment: Equipment, group: EquipmentGroup) => void;
}

const EditEquipmentItemDialog: React.FC<EditEquipmentItemDialogProps> = ({
  open,
  onClose,
  group,
  equipment,
  onEditEquipment,
  onDeleteEquipment,
}) => {
  const [equipmentName, setEquipmentName] = useState(equipment.name);
  const [category, setCategory] = useState(equipment.category);
  const [department, setDepartment] = useState(equipment.department);
  const [quantity, setQuantity] = useState(equipment.quantity);
  const [notes, setNotes] = useState(equipment.notes);
  const [serialNumber, setSerialNumber] = useState(equipment.serialNumber);
  const [errors, setErrors] = useState({
    equipmentName: false,
    category: false,
    department: false,
    quantity: false,
  });

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
    console.log(equipmentName);
  };

  useEffect(() => {
    setErrors({
      equipmentName: equipmentName.trim() === "",
      category: category.trim() === "",
      department: department.trim() === "",
      quantity: quantity <= 0,
    });
  }, [equipmentName, category, department, quantity]);

  const handleEditEquipment = () => {
    if (
      errors.equipmentName ||
      errors.category ||
      errors.department ||
      errors.quantity
    ) {
      return;
    }
    const lastUpdated = new Date().toISOString();
    const newEquipment: Equipment = {
      ...equipment,
      name: equipmentName,
      category,
      department,
      quantity,
      notes,
      serialNumber,
      lastUpdated,
    };

    onEditEquipment(newEquipment, group);

    // Close the dialog
    onClose();
  };

  const handleDelete = () => {
    onDeleteEquipment(equipment, group);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Equipment</DialogTitle>
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
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button color="error" onClick={handleDelete} sx={{ ml: 2 }}>
          Delete
        </Button>
        <Stack direction="row" spacing={2}>
          <Button onClick={handleEditEquipment} color="primary">
            Save
          </Button>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditEquipmentItemDialog;
