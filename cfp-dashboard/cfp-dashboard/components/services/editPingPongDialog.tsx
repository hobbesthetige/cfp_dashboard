import React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";

export interface EditPingPongDialogProps {
  isActive: boolean;
  pingPong?: {
    hostname: string;
    interval: number;
    timeout: number;
    isAutomaticStatusChange: boolean;
  };
  onSave: (
    hostname: string,
    interval: number,
    timeout: number,
    isAutomaticStatusChange: boolean,
    isActive: boolean
  ) => void;
}

const EditPingPongDialog: React.FC<EditPingPongDialogProps> = ({
  onSave,
  pingPong,
  isActive,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isAutomaticStatusChange, setIsAutomaticStatusChange] = React.useState(
    pingPong?.isAutomaticStatusChange || false
  );
  const [interval, setInterval] = React.useState(pingPong?.interval || 5000);
  const [timeout, setTimeout] = React.useState(
    pingPong?.timeout || 60000 * 240
  ); // 4 hours
  const [hostname, setHostname] = React.useState(pingPong?.hostname || "");

  const toggleOpen = () => {
    setOpen(!open);
  };
  const handleSave = () => {
    const newActive = !isActive;
    onSave(hostname, interval, timeout, isAutomaticStatusChange, newActive);
    toggleOpen();
  };

  return (
    <Box>
      <Button onClick={toggleOpen}>Edit Ping Pong</Button>
      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>Ping Pong Setup</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="pingAddress"
            label="Address or Hostname"
            defaultValue="8.8.8.8"
            fullWidth
            margin="normal"
            onChange={(e) => setHostname(e.target.value)}
            value={hostname}
          />
          <TextField
            required
            id="pingInterval"
            label="Ping Interval (seconds)"
            type="number"
            defaultValue={5}
            fullWidth
            margin="normal"
            onChange={(e) => setInterval(parseInt(e.target.value) * 1000)}
            value={interval / 1000}
          />
          <TextField
            required
            id="pingTimeout"
            label="Ping Timeout (minutes)"
            type="number"
            defaultValue={240}
            fullWidth
            margin="normal"
            onChange={(e) => setTimeout(parseInt(e.target.value) * 60000)}
            value={timeout / 60000}
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Update Equipment Status Automatically"
              checked={isAutomaticStatusChange}
              onChange={(e, checked) => setIsAutomaticStatusChange(checked)}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button onClick={toggleOpen} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditPingPongDialog;
