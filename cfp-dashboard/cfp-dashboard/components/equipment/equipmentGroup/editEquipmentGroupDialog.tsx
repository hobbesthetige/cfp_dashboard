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
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  ListItemSecondaryAction,
  Icon,
  IconButton,
  Box,
} from "@mui/material";
import {
  formatDateInZuluTime,
  formatTimestamp,
} from "@/app/utilities/dateFormats";
import { Delete, DeleteOutlined } from "@mui/icons-material";
import AddJobControlNumberDialog from "./addJobControlNumberDialog";

interface EditEquipmentGroupDialogProps {
  group: EquipmentGroup;
  open: boolean;
  onClose: () => void;
  onSave: (group: EquipmentGroup) => void;
  onDelete: (group: EquipmentGroup) => void;
}

const EditEquipmentGroupDialog: React.FC<EditEquipmentGroupDialogProps> = ({
  group,
  open,
  onClose,
  onSave,
  onDelete,
}) => {
  const [errors, setErrors] = useState({ groupName: false });
  const [groupName, setGroupName] = useState(group.name);
  const [utc, setUtc] = useState(group.utc);
  const [jobControlNumbers, setJobControlNumbers] = useState(
    group.jobControlNumbers
  );
  const [openJCNDialog, setOpenJCNDialog] = useState(false);

  const handleAddJCN = (jobControlNumber: JobControlNumber) => {
    setJobControlNumbers((prev) =>
      [...prev, jobControlNumber].sort(
        (a, b) => Number(new Date(b.timestamp)) - Number(new Date(a.timestamp))
      )
    );
    setOpenJCNDialog(false);
  };

  const handleSave = () => {
    const hasError = groupName.trim() === "";
    setErrors({ groupName: hasError });

    if (hasError) {
      return;
    }

    const newGroup: EquipmentGroup = {
      ...group,
      name: groupName,
      utc: utc,
      jobControlNumbers: jobControlNumbers,
    };

    onSave(newGroup);
    onClose();
  };

  const handleDelete = () => {
    onDelete(group);
    onClose();
  };

  function EmptyJCN() {
    return (
      <Typography variant="body1" color="textSecondary">
        No job control numbers added
      </Typography>
    );
  }

  function JCNList() {
    return (
      <List>
        {jobControlNumbers.map((job, index) => (
          <ListItem key={index} disableGutters>
            <ListItemText
              primary={`${job.type} JCN #${job.number}`}
              secondary={`${new Date(
                job.timestamp
              ).toLocaleString()} - ${formatDateInZuluTime(
                new Date(job.timestamp)
              )}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  setJobControlNumbers((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Equipment Group</DialogTitle>
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
        <Divider sx={{ mt: 2, mb: 2 }} />
        {jobControlNumbers.length > 0 ? <JCNList /> : <EmptyJCN />}
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => setOpenJCNDialog(true)}
        >
          Add JCN
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
        <Box>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </Box>
      </DialogActions>
      <AddJobControlNumberDialog
        open={openJCNDialog}
        onClose={() => setOpenJCNDialog(false)}
        onSave={handleAddJCN}
      />
    </Dialog>
  );
};

export default EditEquipmentGroupDialog;
