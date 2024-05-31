import { EquipmentGroup, JobControlNumber } from "@/app/types/equipment";

import React, { useState } from "react";
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

interface AddEquipmentGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: EquipmentGroup) => void;
}

const AddEquipmentGroupDialog: React.FC<AddEquipmentGroupDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const created = new Date().toISOString();
  const [errors, setErrors] = useState({ groupName: false });
  const [groupName, setGroupName] = useState("");
  const [utc, setUtc] = useState("");
  const [jobControlNumber, setJobControlNumber] = useState<JobControlNumber>({
    number: "",
    type: "Installation",
    timestamp: created,
  });

  const handleSave = () => {
    const hasError = groupName.trim() === "";
    setErrors({ groupName: hasError });

    if (hasError) {
      return;
    }

    const jobControlNumbers: JobControlNumber[] = [];
    if (jobControlNumber.number.trim() !== "") {
      jobControlNumbers.push(jobControlNumber);
    }

    const newGroup: EquipmentGroup = {
      id: new Date().toISOString(),
      name: groupName,
      utc,
      jobControlNumbers,
      created,
      equipment: [],
    };

    onSave(newGroup);
    onClose();
  };

  React.useEffect(() => {
    setGroupName("");
    setUtc("");
    setJobControlNumber({
      number: "",
      type: "Installation",
      timestamp: new Date().toISOString(),
    });
    setErrors({ groupName: false });
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Equipment Group</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          required
          error={errors.groupName}
          helperText={errors.groupName ? "Name is required" : ""}
        />
        <TextField
          label="UTC"
          value={utc}
          onChange={(e) => setUtc(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }}>
          <Autocomplete
            disablePortal
            options={["Installation", "Maintenance", "Repair"]}
            sx={{ width: "50%" }}
            value={jobControlNumber.type}
            renderInput={(params) => <TextField {...params} label="JCN Type" />}
            onChange={(event, value) =>
              setJobControlNumber({
                ...jobControlNumber,
                number: jobControlNumber?.number || "",
                type: value || "",
              })
            }
          />
          <TextField
            label="JCN Number"
            value={jobControlNumber.number}
            onChange={(e) =>
              setJobControlNumber({
                ...jobControlNumber,
                number: e.target.value,
                type: jobControlNumber?.type || "",
              })
            }
            sx={{ width: "50%" }}
            variant="outlined"
            margin="normal"
            component="span"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentGroupDialog;
