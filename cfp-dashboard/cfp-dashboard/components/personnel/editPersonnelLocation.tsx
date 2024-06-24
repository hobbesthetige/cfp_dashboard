import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { PersonnelLocation } from "@/app/types/personnel";

interface EditPersonnelLocationProps {
  name: string;
  location: PersonnelLocation;
  open: boolean;
  onUpdate: (
    assignedLocation: string,
    currentLocation: string,
    comments: string
  ) => void;
  onClose: () => void;
}

const EditPersonnelLocation: React.FC<EditPersonnelLocationProps> = ({
  name,
  location,
  open,
  onUpdate,
  onClose,
}) => {
  const [isShowingAssignedLocation, setIsShowingAssignedLocation] =
    useState(false);

  const [currentLocation, setCurrentLocation] = useState(
    location.currentLocation
  );
  const [comments, setComments] = useState(location.comments);
  const [assignedLocation, setAssignedLocation] = useState(
    location.assignedLocation
  );

  const handleCurrentLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentLocation(event.target.value);
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComments(event.target.value);
  };

  const handleAssignedLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssignedLocation(event.target.value);
  };

  const handleSave = () => {
    console.log("Saving location for", assignedLocation, currentLocation);
    onUpdate(assignedLocation, currentLocation, comments);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Location for {name}</DialogTitle>
      <DialogContent>
        {isShowingAssignedLocation ? (
          <TextField
            label="Assigned Location"
            value={assignedLocation}
            onChange={handleAssignedLocationChange}
            fullWidth
            margin="normal"
          />
        ) : (
          <Stack direction="row" spacing={2} alignItems="baseline">
            <Typography>Assigned Location: {assignedLocation}</Typography>
            <Button
              onClick={() => setIsShowingAssignedLocation(true)}
              size="small"
            >
              Change
            </Button>
          </Stack>
        )}
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mt: 2 }}>
          <TextField
            label="Current Location"
            value={currentLocation}
            name="currentLocation"
            onChange={handleCurrentLocationChange}
            margin="normal"
          />
          <Button
            size="small"
            onClick={() => setCurrentLocation(assignedLocation)}
          >
            Use Assigned
          </Button>
        </Stack>
        <TextField
          label="Comments"
          name="comments"
          value={comments}
          onChange={handleCommentsChange}
          fullWidth
          margin="normal"
          onKeyUp={handleKeyPress}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPersonnelLocation;
