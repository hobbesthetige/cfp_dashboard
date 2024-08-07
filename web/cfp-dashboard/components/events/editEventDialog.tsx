import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";
import { EventLog, EventLogLevel } from "./eventsList";
import { getEnumValues } from "@/app/utilities/getEnumValues";
import moment from "moment-timezone";
import { formatDateInZuluTime } from "@/app/utilities/dateFormats";

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
  const [level, setLevel] = useState(event.level);
  const [category, setCategory] = useState(event.category);
  const [message, setMessage] = useState(event.message);
  const [title, setTitle] = useState(event.title);
  const [timestamp, setTimestamp] = useState(formatTimestamp(event.timestamp));
  const [errors, setErrors] = useState({ category: false, title: false });

  const handleSave = () => {
    const hasCategoryError = category.trim() === "";
    const hasTitleError = title.trim() === "";
    setErrors({ category: hasCategoryError, title: hasTitleError });

    if (hasCategoryError || hasTitleError) {
      return;
    }

    const updatedEvent: EventLog = {
      ...event,
      category,
      title,
      message,
      timestamp,
      level,
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
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="Log Level"
            value={level}
            onChange={(e) => setLevel(e.target.value as EventLogLevel)}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            {getEnumValues(EventLogLevel).map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
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
        </Stack>
        <TextField
          label="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.title}
          helperText={errors.title ? "Title is required" : ""}
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={4}
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
          {formatDateInZuluTime(new Date(timestamp))}
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
