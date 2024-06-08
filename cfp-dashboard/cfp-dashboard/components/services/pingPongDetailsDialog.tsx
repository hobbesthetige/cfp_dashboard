import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import {
  formatPingTimeInterval,
  formatTimeInterval,
} from "@/app/utilities/dateFormats";

interface PingPongDetailsDialogProps {
  hostName: string;
  pingResults: boolean[];
  responseTimes: number[];
  errorCount: number;
  averageResponseTime: number;
  currentInterval: number;
  lastUpdated: string;
}

const PingPongDetailsDialog: React.FC<PingPongDetailsDialogProps> = ({
  hostName,
  pingResults,
  responseTimes,
  errorCount,
  averageResponseTime,
  currentInterval,
  lastUpdated,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggleDialog = () => {
    setOpen(!open);
  };
  return (
    <Box>
      <IconButton onClick={toggleDialog}>
        <InfoOutlined />
      </IconButton>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>Continuous Polling Details</DialogTitle>
        <DialogContent>
          <List>
            <ListItem disableGutters>
              <ListItemText primary="Host Name" secondary={hostName} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Current Poll Interval"
                secondary={formatTimeInterval(
                  currentInterval,
                  false,
                  true,
                  true
                )}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Error Count" secondary={errorCount} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Average Response Time"
                secondary={formatPingTimeInterval(averageResponseTime)}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Last Updated"
                secondary={new Date(lastUpdated).toLocaleString()}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Last 10 Ping Results"
                secondary="Rolling 10 ping results with response times."
              />
            </ListItem>
          </List>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ping Number</TableCell>
                  <TableCell>Successful</TableCell>
                  <TableCell>Response Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pingResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result ? "Yes" : "No"}</TableCell>
                    <TableCell align="right">
                      {result
                        ? formatPingTimeInterval(responseTimes[index])
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PingPongDetailsDialog;
