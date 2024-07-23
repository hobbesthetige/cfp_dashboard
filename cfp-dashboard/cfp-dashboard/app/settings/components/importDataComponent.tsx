import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ImportDataComponent: React.FC = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [replaceData, setReplaceData] = useState(false);

  const handleExport = () => {
    setErrorMessage("Importing data is not supported yet.");
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setReplaceData(checked);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <Typography>Import data into the application.</Typography>
        <Alert severity="info">This feature is not supported yet.</Alert>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={replaceData} onChange={handleCheckboxChange} />
            }
            label="Replace existing data with import"
          />
        </FormGroup>
        {replaceData && (
          <Alert severity="warning">
            Importing data may overwrite or corrupt existing data.
          </Alert>
        )}
        <Button
          disabled={isButtonDisabled}
          variant="outlined"
          onClick={handleExport}
        >
          Import Data
        </Button>
      </Stack>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </Box>
  );
};

export default ImportDataComponent;
