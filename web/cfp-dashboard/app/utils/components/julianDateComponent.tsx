import { CopyAllOutlined } from "@mui/icons-material";
import {
  Card,
  Stack,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect, useCallback } from "react";

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

const JulianContainerComponent: React.FC = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Julian Calendar Converter</Typography>
        <Typography>
          Convert dates between the Gregorian and Julian calendars.
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="To Julian" />
            <Tab label="From Julian" />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <DatePickerComponent />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <JulianToDateComponent />
        </TabPanel>
      </Stack>
    </Card>
  );
};

const DatePickerComponent: React.FC = () => {
  const [date, setDate] = useState(dayjs());
  const [julianDate, setJulianDate] = useState("");
  const [julianDayNumber, setJulianDayNumber] = useState("");
  const [isLeapYear, setIsLeapYear] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) {
      return;
    }
    setDate(date);
  };

  useEffect(() => {
    setErrorMessage("");
    try {
      const julian = convertToJulian(date);
      const julianDayNum = convertToJulianDayNumber(date);
      const leapYear = checkLeapYear(date.year());

      setJulianDate(julian);
      setJulianDayNumber(julianDayNum);
      setIsLeapYear(leapYear);
    } catch (error) {
      setErrorMessage("Error converting date to Julian calendar.");
    }
  }, [date]);

  const convertToJulian = (date: Dayjs) => {
    const year = date.year();
    const startOfYearDate = dayjs(`${year}-01-01`);
    const days = date.diff(startOfYearDate, "day") + 1; // Julian days start from 1
    return `${year}${String(days).padStart(3, "0")}`;
  };

  const convertToJulianDayNumber = (date: Dayjs) => {
    const JD = date.toDate().getTime() / 86400000.0 + 2440587.5;
    return JD.toFixed(5);
  };

  const checkLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Typography>
          Select a date to convert to the Julian calendar.
        </Typography>

        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Gregorian Date"
              value={date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  sx: {
                    mt: 1,
                    mb: 2,
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        {julianDate && (
          <>
            <Typography>
              Julian Date: <strong>{julianDate}</strong>
              <IconButton onClick={() => copyToClipboard(julianDate)}>
                <CopyAllOutlined />
              </IconButton>
            </Typography>
            <Typography>
              Julian Day Number: <strong>{julianDayNumber}</strong>
              <IconButton onClick={() => copyToClipboard(julianDayNumber)}>
                <CopyAllOutlined />
              </IconButton>
            </Typography>
            <Typography>
              Leap Year: <strong>{isLeapYear ? "Yes" : "No"}</strong>
            </Typography>
          </>
        )}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </Stack>
    </Box>
  );
};

const JulianToDateComponent: React.FC = () => {
  const [julianDate, setJulianDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleJulianDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJulianDate(event.target.value);
  };

  const convertToGregorian = useCallback(() => {
    setErrorMessage("");
    if (!julianDate) {
      setGregorianDate("");
      return;
    }
    try {
      const date = convertJulianToGregorian(Number(julianDate));
      setGregorianDate(date.format("YYYY-MM-DD"));
    } catch (error) {
      setErrorMessage("Error converting Julian date to Gregorian calendar.");
    }
  }, [julianDate]);

  const convertJulianToGregorian = (JD: number) => {
    const date = dayjs((JD - 2440587.5) * 86400000.0);
    return date;
  };

  useEffect(() => {
    convertToGregorian();
  }, [julianDate, convertToGregorian]);

  useEffect(() => {
    const convertToJulianDayNumber = (date: Dayjs) => {
      const JD = date.toDate().getTime() / 86400000.0 + 2440587.5;
      return JD.toFixed(5);
    };
    setJulianDate(convertToJulianDayNumber(dayjs()));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Typography>
          Enter a Julian day number to convert to the Gregorian calendar.
        </Typography>
        <TextField
          label="Julian Day Number"
          id="julian-date"
          value={julianDate}
          onChange={handleJulianDateChange}
          sx={{ mt: 1, mb: 2 }}
        />
        {gregorianDate && (
          <Typography>
            Gregorian Date: <strong>{gregorianDate}</strong>{" "}
            <IconButton onClick={() => copyToClipboard(gregorianDate)}>
              <CopyAllOutlined />
            </IconButton>
          </Typography>
        )}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </Stack>
    </Box>
  );
};

export default JulianContainerComponent;
