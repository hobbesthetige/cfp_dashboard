import { FPCON, FPCONName, FPCONState, fpcons } from "@/app/types/fpcon";
import { useEventsSocket } from "@/contexts/eventsSocketContext";
import { useFPCON } from "@/contexts/fpconProvider";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventLogLevel } from "../events/eventsList";

interface FpconSelectProps {}

const FpconSelect: React.FC<FpconSelectProps> = ({}) => {
  const { fpconState, updateFPCONState } = useFPCON();
  const { eventsSocket } = useEventsSocket();

  const [value, setValue] = React.useState<FPCON>(fpcons[0]);
  const [lastUpdated, setLastUpdated] = React.useState(
    new Date().toISOString()
  );

  const handleChange = (event: SelectChangeEvent) => {
    const id = event.target.value;
    const fpcon = fpcons.find((fpcon) => fpcon.id === id);
    if (fpcon) {
      emitLevelChangedEventItem(fpconState.currentState, fpcon);
      const lastUpdated = new Date().toISOString();
      setValue(fpcon);
      setLastUpdated(lastUpdated);
      updateFPCONState({
        ...fpconState,
        currentState: fpcon,
        lastUpdated: lastUpdated,
      });
    }
  };

  const handleSocketEvent = useCallback((state: FPCONState) => {
    setValue(state.currentState);
    setLastUpdated(state.lastUpdated);
  }, []);

  const emitLevelChangedEventItem = useCallback(
    (oldValue: FPCON, newValue: FPCON) => {
      const title = `FPCON level changed from ${oldValue.name} to ${newValue.name}`;
      const message = newValue.description || "";
      const level = [FPCONName.Normal, FPCONName.Alpha].includes(
        newValue.name as FPCONName
      )
        ? EventLogLevel.Info
        : EventLogLevel.Alert;

      const emitEventItem = (
        level: EventLogLevel,
        category: string,
        title: string,
        message: string | undefined
      ) => {
        eventsSocket?.emit("newEventItem", {
          id: uuidv4(),
          level,
          category,
          title,
          message: message || "",
          author: "System",
          isUserGenerated: false,
          timestamp: new Date().toISOString(),
        });
      };

      emitEventItem(level, "FPCON", title, message);
    },
    [eventsSocket]
  );

  useEffect(() => {
    handleSocketEvent(fpconState);
  }, [fpconState, handleSocketEvent]);

  return (
    <FormControl>
      <Stack direction="row" spacing={2} alignItems={"center"}>
        <Typography
          variant="h6"
          sx={{
            color: (theme) =>
              theme.palette[fpconState.currentState.color].contrastText,
          }}
        >
          FPCON:
        </Typography>
        <Select
          value={value.id}
          onChange={handleChange}
          size="small"
          sx={{
            color: (theme) =>
              theme.palette[fpconState.currentState.color].contrastText,
          }}
        >
          {fpcons.map((fpcon) => (
            <MenuItem key={fpcon.id} value={fpcon.id}>
              {fpcon.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </FormControl>
  );
};

export default FpconSelect;
