"use client";

import { JobControlNumber } from "@/app/types/equipment";
import TabPanel from "@/components/tab/tabPanel";
import useAxios from "@/contexts/useAxios";
import { Add } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AddJCNDialog: React.FC<{
  groupID: string;
  handleAdd: (jcn: JobControlNumber) => void;
}> = ({ groupID, handleAdd }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Installation");
  const [utc, setUtc] = useState("");
  const [sequence, setSequence] = useState("0001");
  const [jcnNumber, setJcnNumber] = useState("");
  const [tab, setTab] = useState(0);

  const axios = useAxios();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    handleAdd({
      id: uuidv4(),
      type,
      number: jcnNumber,
      timestamp: new Date().toISOString(),
    });
    handleClose();
  };

  useEffect(() => {
    axios.get(`/equipmentGroups/${groupID}`).then((response) => {
      setUtc(response.data.utc);
    });
  }, [axios, groupID]);

  useEffect(() => {
    updateJCNNumber();
  }, [utc, sequence]);

  const updateJCNNumber = () => {
    const jcn = `${utc}${getTwoDigitYear()}${getJulianDate()}${sequence}`;
    console.log(jcn);
    setJcnNumber(jcn);
  };

  const getTwoDigitYear = () => {
    // Return the last two digits of the calendar year.
    return new Date().getFullYear().toString().slice(-2);
  };

  const getJulianDate = () => {
    // Return the Julian date (day of the year, ranging from 001 to 365).
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const julianDate = Math.floor(diff / oneDay);
    return julianDate.toString().padStart(3, "0");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box>
      <IconButton onClick={() => setOpen(true)}>
        <Add />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add JCN</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            The Job Control Number (JCN) is a standardized identifier used
            across various U.S. Air Force units, including combat communication
            units, to track maintenance actions.
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Autocomplete
              disablePortal
              fullWidth
              options={["Installation", "Maintenance", "Other"]}
              value={type}
              renderInput={(params) => (
                <TextField
                  name="type"
                  label="Type"
                  margin="normal"
                  value={type}
                  {...params}
                />
              )}
              onChange={(event, value) => {
                setType(value || "");
              }}
            />
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab label="Automatic JCN" />
                <Tab label="Manual JCN" />
              </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
              <TextField
                id="sequence"
                name="sequence"
                label="Sequence Number"
                helperText="4 digit sequence number"
                type="number"
                margin="normal"
                value={sequence}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  if (value.length <= 4) {
                    setSequence(value); // Allow normal typing
                  }
                }}
                onBlur={() => {
                  setSequence(sequence.padStart(4, "0")); // Apply padding when user exits the field
                }}
                fullWidth
              />
              <TextField
                InputProps={{ readOnly: true }}
                id="number"
                name="number"
                // label="Number"
                margin="normal"
                value={jcnNumber}
                onChange={() => {
                  updateJCNNumber;
                }}
                fullWidth
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Typography variant="body1">
                The general structure of a JCN is as follows:{" "}
                <b>UUUYYJJJSSSS</b>, where:
              </Typography>
              <Box>
                <ul>
                  <li>UUU: Equipment UTC designator.</li>
                  <li>YY: Last two digits of the calendar year.</li>
                  <li>
                    JJJ: Julian date (day of the year, ranging from 001 to 365).
                  </li>
                  <li>
                    SSSS: A four-character alphanumeric serial number unique to
                    the specific job or work order.
                  </li>
                </ul>
              </Box>
              <Typography variant="body1">
                Example: A JCN of 240150123 would correspond to a job initiated
                on January 15, 2024 (24 for the year, 015 for the Julian date),
                with a serial number of 0123.
              </Typography>
              <TextField
                name="jcn"
                label="JCN"
                helperText="Enter a full JCN"
                margin="normal"
                value={jcnNumber}
                onChange={(e) => {
                  setJcnNumber(e.target.value);
                }}
                fullWidth
              />
            </TabPanel>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" onClick={handleSubmit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddJCNDialog;
