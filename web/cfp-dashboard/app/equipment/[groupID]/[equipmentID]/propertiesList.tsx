"use client";
import { Equipment } from "@/app/types/equipment";
import useAxios from "@/contexts/useAxios";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EquipmentPropertiesListProps {
  groupID: string;
  equipment: Equipment;
  handleSave: (e: Equipment) => void;
  handleDelete?: () => void;
}

interface PropertiesProps {
  editingEquipment: Equipment;
  errors: {
    equipmentName: boolean;
    category: boolean;
    department: boolean;
    quantity: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleValueChange: (name: string, value: any) => void;
}

const EquipmentNameCard: React.FC<PropertiesProps> = ({
  editingEquipment,
  errors,
  handleInputChange,
  handleValueChange,
}) => {
  return (
    <Stack
      direction={"row"}
      useFlexGap
      sx={{ flexWrap: "wrap", mt: 4 }}
      spacing={2}
    ></Stack>
  );
};

const EquipmentInventoryCard: React.FC<PropertiesProps> = ({
  editingEquipment,
  errors,
  handleInputChange,
  handleValueChange,
}) => {
  return (
    <Stack sx={{ mt: 4 }} spacing={4}>
      <TextField
        autoFocus
        margin="normal"
        label="Equipment Name"
        sx={{ flexGrow: 1 }}
        type="text"
        name="name"
        value={editingEquipment.name}
        onChange={handleInputChange}
        required
        error={errors.equipmentName}
        helperText={errors.equipmentName ? "Name is required" : ""}
      />
      <Divider />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Autocomplete
          disablePortal
          fullWidth
          options={["Infrastructure", "SATCOM", "CFP", "Other"]}
          value={editingEquipment.department}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Department"
              type="text"
              fullWidth
              value={editingEquipment.department}
              required
              error={errors.department}
              helperText={errors.department ? "Department is required" : ""}
            />
          )}
          onChange={(event, value) => {
            handleValueChange("department", value || "");
          }}
        />
        <Autocomplete
          disablePortal
          fullWidth
          options={[
            "Networking Equipment",
            "SATCOM Equipment",
            "Radios",
            "Computers",
            "Monitors",
            "Other",
          ]}
          value={editingEquipment.category}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              name="category"
              label="Category"
              type="text"
              fullWidth
              value={editingEquipment.category}
              required
              error={errors.category}
              helperText={errors.category ? "Category is required" : ""}
            />
          )}
          onChange={(event, value) => {
            handleValueChange("category", value || "");
          }}
        />
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ flexGrow: 1 }}
      >
        <TextField
          margin="normal"
          label="Quantity"
          type="number"
          name="quantity"
          value={editingEquipment.quantity}
          onChange={handleInputChange}
          required
          error={errors.quantity}
          helperText={errors.quantity ? "Quantity is required" : ""}
        />
        <TextField
          margin="normal"
          label="Serial Number"
          type="text"
          name="serialNumber"
          sx={{ flexGrow: 1 }}
          value={editingEquipment.serialNumber}
          onChange={handleInputChange}
        />
      </Stack>
      <Divider />
      <TextField
        margin="normal"
        label="Notes"
        sx={{ flexGrow: 1 }}
        type="text"
        name="notes"
        value={editingEquipment.notes}
        onChange={handleInputChange}
      />
    </Stack>
  );
};

const EquipmentPropertiesList: React.FC<EquipmentPropertiesListProps> = ({
  groupID,
  equipment,
  handleSave,
  handleDelete,
}) => {
  const axious = useAxios();
  const router = useRouter();

  const [editingEquipment, setEditingEquipment] = useState(equipment);

  const [errors, setErrors] = useState({
    equipmentName: false,
    category: false,
    department: false,
    quantity: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingEquipment({
      ...editingEquipment,
      [e.target.name]: e.target.value,
    });
  };

  const handleValueChange = (name: string, value: any) => {
    setEditingEquipment({
      ...editingEquipment,
      [name]: value,
    });
  };

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  return (
    <Card sx={{ p: 4, mt: 4 }}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Equipment Item</Typography>
      </Stack>
      <EquipmentInventoryCard
        editingEquipment={editingEquipment}
        errors={errors}
        handleInputChange={handleInputChange}
        handleValueChange={handleValueChange}
      />
      <Stack direction={"row"} spacing={2} sx={{ mt: 4 }}>
        {handleDelete && (
          <Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setOpenDeleteConfirmation(true);
              }}
            >
              Delete
            </Button>
            <DeleteConfirmationDialog
              open={openDeleteConfirmation}
              handleClose={() => setOpenDeleteConfirmation(false)}
              handleDelete={() => {
                handleDelete();
              }}
            />
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={() => router.push(`/equipment/${groupID}`)}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={() => handleSave(editingEquipment)}>
          Save
        </Button>
      </Stack>
    </Card>
  );
};

const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}> = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Equipment Item</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this equipment item?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentPropertiesList;
