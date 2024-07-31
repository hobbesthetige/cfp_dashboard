import useAxios from "@/contexts/useAxios";
import {
  Card,
  Stack,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Settings } from "../types/settings";

interface ExportDataComponentProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const ExportDataComponent: React.FC<ExportDataComponentProps> = ({
  settings,
  setSettings,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const axios = useAxios();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  useEffect(() => {
    setIsButtonDisabled(
      !Object.values(settings).some((value) => value) || isExporting
    );
  }, [settings, isExporting]);

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

  const beginExport = () => {
    setIsExporting(true);
    setErrorMessage("");
  };

  const downloadFile = (data: Blob, filename: string) => {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const endExport = () => {
    setIsExporting(false);
  };

  const handleExport = async () => {
    beginExport();
    try {
      const response = await axios.post("/export", settings, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], { type: "application/gzip" });
      downloadFile(blob, "cfp-export.json.gz");
    } catch (error: any) {
      console.error("Error exporting data:", error);
      setErrorMessage(error.message);
    } finally {
      endExport();
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack spacing={2}>
        {/* <Typography variant="h6">Export Data</Typography> */}
        <Typography>
          Export your data as a zip file for backups or use in other
          applications.
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSettingsChecked()}
                indeterminate={!allSettingsChecked() && !noSettingsChecked()}
                onChange={handleParentCheckboxChange}
              />
            }
            label="Export all data"
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
                  label={`Export ${
                    item.charAt(0).toUpperCase() + item.slice(1)
                  }`}
                />
              ))}
            </Box>
          )}
        </FormGroup>
        <Button
          disabled={isButtonDisabled}
          variant="outlined"
          onClick={handleExport}
        >
          Export Data
        </Button>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </Stack>
    </Box>
  );
};

export default ExportDataComponent;
