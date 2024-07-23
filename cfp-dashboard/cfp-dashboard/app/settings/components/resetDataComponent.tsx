import useAxios from "@/contexts/useAxios";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Settings, defaultSettings } from "../types/settings";
import React, { use, useState } from "react";

interface ResetDataComponentProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const ResetDataComponent: React.FC<ResetDataComponentProps> = ({
  settings,
  setSettings,
}) => {
  const axios = useAxios();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleReset = async () => {
    setIsLoading(true);
    const resp = await axios.post("/reset", settings);
    setIsLoading(false);
    setResponseMessage(resp.data.message);
    setSettings(defaultSettings);
  };

  const promptDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteAccept = () => {
    handleReset();
    setShowDeleteConfirm(false);
  };

  const handleDeleteDecline = () => {
    setShowDeleteConfirm(false);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleParentCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setSettings(
      Object.keys(settings).reduce((acc, key) => {
        acc[key as keyof typeof settings] = checked;
        return acc;
      }, {} as Settings)
    );
  };

  const allSettingsChecked = () => {
    return Object.values(settings).every((value) => value);
  };

  const noSettingsChecked = () => {
    return Object.values(settings).every((value) => !value);
  };

  const submitDisabled = () => {
    return noSettingsChecked() || isLoading;
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack spacing={2}>
        {isLoading && <LoadingComponent />}
        {responseMessage && <ResponseComponent message={responseMessage} />}
        {!isLoading && !responseMessage && (
          <>
            <Typography>
              Reset data in the application. This action is irreversible.
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSettingsChecked()}
                    indeterminate={
                      !allSettingsChecked() && !noSettingsChecked()
                    }
                    onChange={handleParentCheckboxChange}
                  />
                }
                label="Reset all data"
              />
              {!allSettingsChecked() && (
                <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                  {Object.keys(settings).map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={settings[item as keyof typeof settings]}
                          onChange={handleCheckboxChange}
                          name={item}
                        />
                      }
                      label={`Reset ${
                        item.charAt(0).toUpperCase() + item.slice(1)
                      }`}
                    />
                  ))}
                </Box>
              )}
            </FormGroup>
            {allSettingsChecked() && (
              <Alert severity="warning">
                Resetting data will remove all data from the application and
                cannot be undone. Make sure to export your data before
                resetting.
              </Alert>
            )}
            <Button
              variant="outlined"
              color="error"
              onClick={promptDeleteConfirm}
              disabled={submitDisabled()}
            >
              Reset Data
            </Button>
          </>
        )}
      </Stack>
      <DeleteConfirmationDialog
        onAccept={handleDeleteAccept}
        onDecline={handleDeleteDecline}
        open={showDeleteConfirm}
      />
    </Box>
  );
};

const DeleteConfirmationDialog: React.FC<{
  onAccept: () => void;
  onDecline: () => void;
  open: boolean;
}> = ({ onAccept, onDecline, open }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Are you sure you want to delete this data?</DialogTitle>
      <DialogActions>
        <Button onClick={onDecline}>Cancel</Button>
        <Button onClick={onAccept} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LoadingComponent: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Typography>Resetting data...</Typography>
      <LinearProgress />
    </Stack>
  );
};

const ResponseComponent: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="success">{message}</Alert>
    </Box>
  );
};

export default ResetDataComponent;
