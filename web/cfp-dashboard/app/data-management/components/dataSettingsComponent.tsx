import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { defaultSettings } from "../types/settings";
import ExportDataComponent from "./exportDataComponent";
import ResetDataComponent from "./resetDataComponent";
import ImportDataComponent from "./importDataComponent";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const DataSettingsComponent = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Data Settings</Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Export" />
            <Tab label="Import" />
            <Tab label="Reset" />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <ExportDataComponent settings={settings} setSettings={setSettings} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ImportDataComponent />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <ResetDataComponent settings={settings} setSettings={setSettings} />
        </TabPanel>
      </Stack>
    </Card>
  );
};

export default DataSettingsComponent;
