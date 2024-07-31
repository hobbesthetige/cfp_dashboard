import React, { useCallback, useEffect, useState } from "react";
import { InlineLoading } from "../loading";
import { Box, Stack } from "@mui/material";
import PacePlanLetter from "./pacePlanLetter";
import { green, orange, red, yellow } from "@mui/material/colors";
import { useSocket } from "@/contexts/socketContext";
import { useEventsSocket } from "@/contexts/eventsSocketContext";
import { EventLogLevel } from "../events/eventsList";
import { EquipmentGroup } from "@/app/types/equipment";
import useAxios from "@/contexts/useAxios";

type PacePlanLetter = "P" | "A" | "C" | "E";

interface PacePlan {
  P: {
    equipmentName: string;
    equipmentGroupID: string | undefined;
    title: string;
  };
  A: {
    equipmentName: string;
    equipmentGroupID: string | undefined;
    title: string;
  };
  C: {
    equipmentName: string;
    equipmentGroupID: string | undefined;
    title: string;
  };
  E: {
    equipmentName: string;
    equipmentGroupID: string | undefined;
    title: string;
  };
  activePlans: string[];
  lastUpdated: string;
}

const PacePlanBanner = () => {
  const [pacePlan, setPacePlan] = useState<PacePlan>({
    P: { equipmentName: "", equipmentGroupID: undefined, title: "Primary" },
    A: { equipmentName: "", equipmentGroupID: undefined, title: "Alternate" },
    C: { equipmentName: "", equipmentGroupID: undefined, title: "Contingency" },
    E: { equipmentName: "", equipmentGroupID: undefined, title: "Emergency" },
    activePlans: ["P"],
    lastUpdated: new Date().toISOString(),
  });
  const { isConnected, error, socket } = useSocket();
  const { eventsSocket } = useEventsSocket();
  const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
  const axios = useAxios();
  const namespace = "pacePlan";

  const handlePacePlan = useCallback((pacePlan: PacePlan) => {
    console.log("Received updated pace plan:", pacePlan);
    setPacePlan(pacePlan);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(namespace, handlePacePlan);
      return () => {
        socket.off(namespace, handlePacePlan);
      };
    }
  }, [socket, isConnected, handlePacePlan]);

  useEffect(() => {
    axios.get("equipmentGroups").then((response) => {
      setEquipmentGroups(response.data);
    });
  }, []);

  function handleChange(
    pacePlanLetter: PacePlanLetter,
    isActive: boolean,
    equipmentName: string,
    equipmentGroupID: string | undefined
  ) {
    const updatedPacePlan = { ...pacePlan };
    emitUpdatedPacePlanEventItem(
      pacePlanLetter,
      pacePlan[pacePlanLetter].equipmentName,
      equipmentName,
      pacePlan.activePlans.includes(pacePlanLetter),
      isActive
    );
    if (isActive) {
      if (!updatedPacePlan.activePlans.includes(pacePlanLetter)) {
        updatedPacePlan.activePlans.push(pacePlanLetter);
      }
    } else {
      updatedPacePlan.activePlans = updatedPacePlan.activePlans.filter(
        (plan) => plan !== pacePlanLetter
      );
    }
    updatedPacePlan[pacePlanLetter].equipmentName = equipmentName;
    updatedPacePlan[pacePlanLetter].equipmentGroupID = equipmentGroupID;
    setPacePlan(updatedPacePlan);
    socket?.emit(namespace, updatedPacePlan);
  }

  function emitUpdatedPacePlanEventItem(
    pacePlanLetter: PacePlanLetter,
    oldEquipment: string,
    equipment: string,
    oldIsActive: boolean,
    isActive: boolean
  ) {
    console.log("Emitting updated pace plan event item", {
      oldEquipment,
      equipment,
      oldIsActive,
      isActive,
    });
    if (oldEquipment !== equipment) {
      console.log("Equipment changed:", oldEquipment, "->", equipment);
      emitEventItem(
        EventLogLevel.Info,
        "Pace Plan",
        `Updated ${pacePlan[pacePlanLetter].title} equipment to ${equipment}`,
        ""
      );
    } else {
      console.log("No change in equipment:", oldEquipment, equipment);
    }
    if (oldIsActive !== isActive) {
      console.log("Activity status changed:", oldIsActive, "->", isActive);
      emitEventItem(
        isActive ? EventLogLevel.Info : EventLogLevel.Warning,
        "Pace Plan",
        `${isActive ? "Activated" : "Deactivated"} ${
          pacePlan[pacePlanLetter].title
        } equipment ${equipment}`,
        ""
      );
    } else {
      console.log("No change in activity status:", oldIsActive, isActive);
    }
  }
  function emitEventItem(
    level: EventLogLevel,
    category: string,
    title: string,
    message: string | undefined
  ) {
    eventsSocket?.emit("newEventItem", {
      id: new Date().toISOString(),
      level,
      category,
      title,
      message: message || "",
      author: "System",
      isUserGenerated: false,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <Box sx={{ maxWidth: "100%", flexGrow: 1 }}>
      {isConnected ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center" // center the items horizontally
        >
          <PacePlanLetter
            letter="P"
            groups={equipmentGroups}
            equipmentID={pacePlan.P.equipmentGroupID}
            equipmentName={pacePlan.P.equipmentName}
            isActive={pacePlan.activePlans.includes("P")}
            color={green[500]}
            handleChange={(isActive, equipmentName, equipmentGroupID) =>
              handleChange("P", isActive, equipmentName, equipmentGroupID)
            }
          />
          <PacePlanLetter
            letter="A"
            groups={equipmentGroups}
            equipmentID={pacePlan.A.equipmentGroupID}
            equipmentName={pacePlan.A.equipmentName}
            isActive={pacePlan.activePlans.includes("A")}
            color={yellow[500]}
            handleChange={(isActive, equipmentName, equipmentGroupID) =>
              handleChange("A", isActive, equipmentName, equipmentGroupID)
            }
          />
          <PacePlanLetter
            letter="C"
            groups={equipmentGroups}
            equipmentID={pacePlan.C.equipmentGroupID}
            equipmentName={pacePlan.C.equipmentName}
            isActive={pacePlan.activePlans.includes("C")}
            color={orange[500]}
            handleChange={(isActive, equipmentName, equipmentGroupID) =>
              handleChange("C", isActive, equipmentName, equipmentGroupID)
            }
          />
          <PacePlanLetter
            letter="E"
            groups={equipmentGroups}
            equipmentID={pacePlan.E.equipmentGroupID}
            equipmentName={pacePlan.E.equipmentName}
            isActive={pacePlan.activePlans.includes("E")}
            color={red[500]}
            handleChange={(isActive, equipmentName, equipmentGroupID) =>
              handleChange("E", isActive, equipmentName, equipmentGroupID)
            }
          />
        </Stack>
      ) : (
        <InlineLoading />
      )}
      {error && <p>Error: {error}</p>}
    </Box>
  );
};

export default PacePlanBanner;
