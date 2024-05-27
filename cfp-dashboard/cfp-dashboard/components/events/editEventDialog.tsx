import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { EventLog } from "./eventsList";
import moment from "moment-timezone";

interface EditEventDialogProps {
  event: EventLog;
  onSave: (updatedEvent: EventLog) => void;
  onDelete: (event: EventLog) => void;
  onCancel: () => void;
}

const formatTimestamp = (timestamp: string) => {
  return moment(timestamp).format("YYYY-MM-DDTHH:mm");
};

const EditEventDialog: React.FC<EditEventDialogProps> = ({
  event,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [category, setCategory] = useState(event.category);
  const [message, setMessage] = useState(event.message);
  const [timestamp, setTimestamp] = useState(formatTimestamp(event.timestamp));
  const [errors, setErrors] = useState({ category: false });

  const handleSave = () => {
    const hasError = category.trim() === "";
    setErrors({ category: hasError });

    if (hasError) {
      return;
    }

    const updatedEvent: EventLog = {
      ...event,
      category,
      message,
      timestamp,
    };
    onSave(updatedEvent);
  };

  const handleDelete = () => {
    onDelete(event);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      onKeyUp={handleKeyPress}
    >
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent sx={{ paddingTop: 2 }}>
        <TextField
          label="Category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.category}
          helperText={errors.category ? "Category is required" : ""}
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Date Time Stamp"
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Typography variant="caption" color="textSecondary">
          {new Date(timestamp).toISOString().slice(0, 19).replace("T", " ") +
            " Zulu"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="secondary" sx={{ pl: 2 }}>
          Delete
        </Button>
        <div style={{ flex: 1 }} />
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventDialog;
