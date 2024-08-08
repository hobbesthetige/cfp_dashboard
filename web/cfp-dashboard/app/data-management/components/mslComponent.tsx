import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { use, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import useAxios from "@/contexts/useAxios";
import { EventLogLevel } from "@/components/events/eventsList";
import { getEnumValues } from "@/app/utilities/getEnumValues";
import { useSocket } from "@/contexts/socketContext";

interface MSLSettings {
  includeSystemEvents: boolean;
  includeLogLevel: boolean;
  logLevels: EventLogLevel[];
  categories: string[];
}

interface MSLEventParameters {
  categories: string[];
  earliest: string;
  latest: string;
}

const allLogLevels: EventLogLevel[] = getEnumValues(EventLogLevel);

const MSLComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentStatus, setDocumentStatus] = useState<string | null>(null);

  const axios = useAxios();
  const { isConnected, socket } = useSocket();

  const beginExport = () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleExport = async (settings: MSLSettings) => {
    beginExport();
    try {
      const resp = await axios.post("/makeMSL", settings);
      const { id, status } = resp.data;
      setDocumentId(id);
      setDocumentStatus(status);
    } catch (error: any) {
      console.error("Error exporting data:", error);
      setErrorMessage(error.message);
    } finally {
      endExport();
    }
  };

  const handleDownload = useCallback(async () => {
    if (!documentId) {
      return;
    }

    try {
      const resp = await axios.get(`/generatedPdfs/${documentId}/download`, {
        responseType: "blob",
      });
      console.log("Downloaded file:", resp);
      downloadFile(resp.data, `MSL_${documentId}.pdf`);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      setErrorMessage(error.message);
    } finally {
      setDocumentId(null);
      setIsLoading(false);
    }
  }, [documentId, axios]);

  useEffect(() => {
    if (!documentId || !socket) {
      return;
    }

    socket.on("pdfGenerationStarted", (docId: string) => {
      if (docId === documentId) {
        setDocumentStatus("Generating PDF...");
      }
    });

    socket.on("pdfGenerationComplete", (docId: string) => {
      console.log("Generating file complete:", docId);
      if (docId === documentId) {
        setDocumentStatus("Complete");
        handleDownload();
      }
    });

    socket.on("pdfGenerationError", (data: { id: string; error: string }) => {
      if (data.id === documentId) {
        setDocumentStatus("Error");
        setErrorMessage(data.error);
        setDocumentId(null);
        setIsLoading(false);
      }
    });

    return () => {
      socket.off("pdfGenerationStarted");
      socket.off("pdfGenerationComplete");
      socket.off("pdfGenerationError");
    };
  }, [documentId, socket, handleDownload]);

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Master Station Log</Typography>
        {isLoading && <LoadingComponent />}
        {!isLoading && <SettingsComponent handleExport={handleExport} />}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </Stack>
    </Card>
  );
};

const SettingsComponent: React.FC<{
  handleExport: (settings: MSLSettings) => void;
}> = ({ handleExport }) => {
  const axios = useAxios();

  const [settings, setSettings] = useState<MSLSettings>({
    includeSystemEvents: true,
    includeLogLevel: false,
    logLevels: allLogLevels,
    categories: [],
  });

  const [eventParameters, setEventParameters] = useState<MSLEventParameters>({
    categories: [],
    earliest: dayjs().subtract(1, "week").toISOString(),
    latest: dayjs().toISOString(),
  });

  useEffect(() => {
    const fetchEventParameters = async () => {
      const resp = await axios.get("/events/mslEventParameters");
      console.log(resp.data);
      setEventParameters(resp.data);
      setSettings((prevSettings) => ({
        ...prevSettings,
        categories: resp.data.categories,
      }));
    };

    fetchEventParameters();
  }, [axios]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    console.log(name, checked);
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const allLogLevelsChecked = () => {
    return (
      allLogLevels.length === settings.logLevels.length &&
      allLogLevels.every((level) => settings.logLevels.includes(level))
    );
  };

  const noLogLevelsChecked = () => {
    return settings.logLevels.length === 0;
  };

  const allCategoriesChecked = () => {
    return (
      eventParameters.categories.length === settings.categories.length &&
      eventParameters.categories.every((category) =>
        settings.categories.includes(category)
      )
    );
  };

  const noCategoriesChecked = () => {
    return settings.categories.length === 0;
  };

  const handleParentLogLevelsCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      logLevels: checked ? allLogLevels : [],
    }));
  };

  const handleLogLevelCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      logLevels: checked
        ? [...prevSettings.logLevels, name as EventLogLevel]
        : prevSettings.logLevels.filter((level) => level !== name),
    }));
  };

  const handleParentCategoriesCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      categories: checked ? eventParameters.categories : [],
    }));
  };

  const handleCategoryCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      categories: checked
        ? [...prevSettings.categories, name]
        : prevSettings.categories.filter((category) => category !== name),
    }));
  };

  const submitDisabled = () => {
    return noLogLevelsChecked() || noCategoriesChecked();
  };

  return (
    <Stack spacing={2}>
      <Typography>
        The Master Station Log (MSL) is a record of all events that occur in the
        system. You can modify the settings below to customize the MSL output.
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              name="includeSystemEvents"
              checked={settings.includeSystemEvents}
              onChange={handleCheckboxChange}
            />
          }
          label="Show system generated events"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              name="includeLogLevel"
              checked={settings.includeLogLevel}
              onChange={handleCheckboxChange}
            />
          }
          label="Show log levels in event description"
        />
      </FormGroup>
      <Stack direction="row" spacing={2}>
        <LogLevelsComponent
          allLogLevelsChecked={allLogLevelsChecked}
          noLogLevelsChecked={noLogLevelsChecked}
          handleParentLogLevelsCheckboxChange={
            handleParentLogLevelsCheckboxChange
          }
          handleLogLevelCheckboxChange={handleLogLevelCheckboxChange}
          settings={settings}
        />
        <CategoriesComponent
          allCategoriesChecked={allCategoriesChecked}
          noCategoriesChecked={noCategoriesChecked}
          handleParentCategoriesCheckboxChange={
            handleParentCategoriesCheckboxChange
          }
          handleCategoryCheckboxChange={handleCategoryCheckboxChange}
          settings={settings}
          eventParameters={eventParameters}
        />
      </Stack>
      <Button
        disabled={submitDisabled()}
        variant="outlined"
        onClick={() => handleExport(settings)}
      >
        Generate MSL
      </Button>
    </Stack>
  );
};

const LogLevelsComponent: React.FC<{
  allLogLevelsChecked: () => boolean;
  noLogLevelsChecked: () => boolean;
  handleParentLogLevelsCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleLogLevelCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  settings: MSLSettings;
}> = ({
  allLogLevelsChecked,
  noLogLevelsChecked,
  handleParentLogLevelsCheckboxChange,
  handleLogLevelCheckboxChange,
  settings,
}) => {
  return (
    <Card variant="outlined" sx={{ p: 2, width: "50%" }}>
      <Typography variant="h6">Log Levels</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={allLogLevelsChecked()}
              indeterminate={!allLogLevelsChecked() && !noLogLevelsChecked()}
              onChange={handleParentLogLevelsCheckboxChange}
            />
          }
          label="Export all log levels"
        />
        {!allLogLevelsChecked() && (
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            {allLogLevels.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={settings.logLevels.includes(item)}
                    onChange={handleLogLevelCheckboxChange}
                    name={item}
                  />
                }
                label={item}
              />
            ))}
          </Box>
        )}
      </FormGroup>
    </Card>
  );
};

const CategoriesComponent: React.FC<{
  allCategoriesChecked: () => boolean;
  noCategoriesChecked: () => boolean;
  handleParentCategoriesCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleCategoryCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  settings: MSLSettings;
  eventParameters: MSLEventParameters;
}> = ({
  allCategoriesChecked,
  noCategoriesChecked,
  handleParentCategoriesCheckboxChange,
  handleCategoryCheckboxChange,
  settings,
  eventParameters,
}) => {
  return (
    <Card variant="outlined" sx={{ p: 2, width: "50%" }}>
      <Typography variant="h6">Categories</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={allCategoriesChecked()}
              indeterminate={!allCategoriesChecked() && !noCategoriesChecked()}
              onChange={handleParentCategoriesCheckboxChange}
            />
          }
          label="Export all categories"
        />
        {!allCategoriesChecked() && (
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            {eventParameters.categories.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={settings.categories.includes(item)}
                    onChange={handleCategoryCheckboxChange}
                    name={item}
                  />
                }
                label={item}
              />
            ))}
          </Box>
        )}
      </FormGroup>
    </Card>
  );
};

const LoadingComponent: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Typography>Creating MSL...</Typography>
      <LinearProgress />
    </Stack>
  );
};

export default MSLComponent;
