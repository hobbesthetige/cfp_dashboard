import { EquipmentGroup, EquipmentService } from "@/app/types/equipment";
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  formatDateInZuluTime,
  formatPingTimeInterval,
  formatTimeInterval,
} from "@/app/utilities/dateFormats";
import { useEffect, useState } from "react";
import EditStatusDialog from "./editStatusDialog";
import { EventsSocketProvider } from "@/contexts/eventsSocketContext";
import { SocketProvider, useSocket } from "@/contexts/socketContext";
import PingPongDetailsDialog from "./pingPongDetailsDialog";

interface ServiceStatusIndicatorProps {
  group: EquipmentGroup;
  service: EquipmentService;
}

interface Pong {
  serviceId: string;
  hostname: string;
  pingResults: boolean[];
  responseTimes: number[];
  errorCount: number;
  status: string;
  statusColor:
    | "default"
    | "info"
    | "success"
    | "primary"
    | "secondary"
    | "error";
  currentInterval: number;
  averageResponseTime: number;
  lastUpdated: string;
}

const ServiceStatusIndicator: React.FC<ServiceStatusIndicatorProps> = ({
  group,
  service,
}) => {
  const [open, setOpen] = useState(false);
  const { socket } = useSocket();
  const [pong, setPong] = useState<Pong>();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        setCurrentTime(new Date());
      }, 500); // Half of the interval time for fade-out and fade-in
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleDialog = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (socket) {
      socket.on("pong", (pong: Pong) => {
        setPong(pong);
      });
      return () => {
        socket.off("pong");
      };
    }
  }, [socket]);

  return (
    <Box sx={{ pb: 2 }}>
      <ListItem disablePadding disableGutters>
        <ListItemButton
          onClick={toggleDialog}
          sx={{ alignItems: "flex-start" }}
        >
          <ListItemText
            primary={`${service.enclave} ${service.serviceName}`}
            secondary={
              <div>
                <div>{`Last updated ${new Date(
                  service.lastUpdated
                ).toLocaleString()}`}</div>
                <div>{`${formatDateInZuluTime(
                  new Date(service.lastUpdated)
                )}`}</div>
              </div>
            }
          />
          <Stack direction="column" spacing={0} alignItems="center">
            <Chip label={service.status} color={service.statusColor} />
            <Typography variant="caption" color="textSecondary">
              {`${formatTimeInterval(
                currentTime.getTime() - new Date(service.lastUpdated).getTime(),
                false,
                true,
                false
              )}`}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
      {pong && service.pingPong?.isActive && (
        <Stack direction="row" sx={{ mt: 1 }} alignItems={"center"}>
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ pl: 2 }}>
              {formatTimeInterval(pong.currentInterval, false, true, true)}{" "}
              Polling Status:{" "}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label={pong.status}
              color={pong.statusColor}
            />
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ pl: 2 }}
              // component="div"
            >
              {`Average Response Time: ${formatPingTimeInterval(
                pong.averageResponseTime
              )}`}
            </Typography>
          </Box>
          <div style={{ flex: 1 }} />
          <Box sx={{ pr: 2 }}>
            <PingPongDetailsDialog
              hostName={pong.hostname}
              pingResults={pong.pingResults}
              responseTimes={pong.responseTimes}
              averageResponseTime={pong.averageResponseTime}
              errorCount={pong.errorCount}
              currentInterval={pong.currentInterval}
              lastUpdated={pong.lastUpdated}
            />
          </Box>
        </Stack>
      )}
      <EditStatusDialog
        group={group}
        service={service}
        open={open}
        onClose={toggleDialog}
      />
    </Box>
  );
};

export default ServiceStatusIndicator;
