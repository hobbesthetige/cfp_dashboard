import { JobControlNumber } from "@/app/types/equipment";
import {
  Stack,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { formatDateInZuluTime } from "@/app/utilities/dateFormats";

import React from "react";

interface AddJobControlNumberDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (jobControlNumber: JobControlNumber) => void;
}

const formatTimestamp = (timestamp: string) => {
  return moment(timestamp).format("YYYY-MM-DDTHH:mm");
};

const AddJobControlNumberDialog: React.FC<AddJobControlNumberDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [errors, setErrors] = useState({ number: false, type: false });
  const [jobControlNumber, setJobControlNumber] = useState<JobControlNumber>({
    number: "",
    type: "Installation",
    timestamp: formatTimestamp(new Date().toISOString()),
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (errors.number || errors.type) {
      return;
    }
    onSave(jobControlNumber);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Job Control Number</DialogTitle>
      <DialogContent>
        <Autocomplete
          disablePortal
          options={["Installation", "Maintenance", "Repair"]}
          fullWidth
          value={jobControlNumber.type}
          renderInput={(params) => (
            <TextField
              {...params}
              label="JCN Type"
              required
              helperText={errors.type ? "Type is required" : ""}
              error={errors.type}
              margin="normal"
            />
          )}
          onChange={(event, value) => {
            setJobControlNumber({
              ...jobControlNumber,
              number: jobControlNumber?.number || "",
              type: value || "",
            });
            const hasError = !value;
            setErrors({ ...errors, type: hasError });
          }}
        />
        <TextField
          label="JCN Number"
          value={jobControlNumber.number}
          onChange={(e) => {
            setJobControlNumber({
              ...jobControlNumber,
              number: e.target.value,
              type: jobControlNumber?.type || "",
            });
            const hasError = e.target.value.trim() === "";
            setErrors({ ...errors, number: hasError });
          }}
          fullWidth
          variant="outlined"
          margin="normal"
          component="span"
          required
          error={errors.number}
          helperText={errors.number ? "Number is required" : ""}
        />
        <TextField
          label="Date Time Stamp"
          type="datetime-local"
          value={jobControlNumber.timestamp}
          onChange={(e) =>
            setJobControlNumber({
              ...jobControlNumber,
              timestamp: e.target.value,
            })
          }
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Typography variant="caption" color="textSecondary">
          {formatDateInZuluTime(new Date(jobControlNumber.timestamp))}
        </Typography>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobControlNumberDialog;
