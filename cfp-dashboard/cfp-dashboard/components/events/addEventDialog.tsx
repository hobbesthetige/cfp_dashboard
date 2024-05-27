import React, { use, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { EventLog } from "./eventsList";
import moment from "moment-timezone";

interface AddEventDialogProps {
  open: boolean;
  onSave: (updatedEvent: EventLog) => void;
  onCancel: () => void;
}

const formatTimestamp = (timestamp: string) => {
  return moment(timestamp).format("YYYY-MM-DDTHH:mm");
};

const AddEventDialog: React.FC<AddEventDialogProps> = ({
  open,
  onSave,
  onCancel,
}) => {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [timestamp, setTimestamp] = useState(
    formatTimestamp(new Date().toISOString())
  );
  const [errors, setErrors] = useState({ category: false });

  const presets = [
    { name: "Begin Exercise", category: "CFP" },
    { name: "Pause Exercise", category: "CFP" },
    { name: "End Exercise", category: "CFP" },
    { name: "Personnel Onstation", category: "CFP" },
    { name: "Safety Brief", category: "CFP" },
    { name: "Power Online", category: "CFP" },
    { name: "Power Offline", category: "CFP" },
  ];

  const clearForm = () => {
    setCategory("");
    setMessage("");
    setTimestamp(formatTimestamp(new Date().toISOString()));
  };

  const handleSave = () => {
    const hasError = category.trim() === "";
    setErrors({ category: hasError });

    if (hasError) {
      return;
    }

    const newEvent: EventLog = {
      id: new Date().toISOString(),
      category,
      message,
      isUserGenerated: true,
      author: "User",
      timestamp,
    };
    onSave(newEvent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handlePreset = (preset: string, category: string) => {
    setCategory(category);
    setMessage(preset);
  };

  React.useEffect(() => {
    if (open) {
      clearForm();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      onKeyUp={handleKeyPress}
    >
      <DialogTitle>Add Event</DialogTitle>
      <Box
        sx={{ marginLeft: 3, marginRight: 0, marginTop: 2, width: "100%" }}
        maxWidth="100%"
      >
        <Grid
          container
          component="div"
          spacing={3}
          maxWidth="100%"
          sx={{ width: "100%" }}
        >
          {presets.map((preset) => (
            <Grid item xs="auto" key={preset.name}>
              <Button
                variant="outlined"
                onClick={() => {
                  handlePreset(preset.name, preset.category);
                }}
              >
                {preset.name}
              </Button>
            </Grid>
          ))}
          <Grid item xs="auto" sx={{ width: "100%" }}>
            <Button
              variant="outlined"
              onClick={() => {
                handlePreset("Power Online", "CFP");
              }}
            >
              Power Online
            </Button>
          </Grid>
        </Grid>
      </Box>
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

export default AddEventDialog;
