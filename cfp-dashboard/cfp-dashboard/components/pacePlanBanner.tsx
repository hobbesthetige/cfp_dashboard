import React, { useCallback, useEffect, useState } from "react";
import { InlineLoading } from "./loading";
import { Stack } from "@mui/material";
import PacePlanLetter from "./pacePlanLetter";
import { green, orange, red, yellow } from "@mui/material/colors";
import { useSocket } from "@/contexts/socketContext";
import { useEventsSocket } from "@/contexts/eventsSocketContext";
import { EventLogLevel } from "./events/eventsList";

type PacePlanLetter = "P" | "A" | "C" | "E";

interface PacePlan {
  P: { equipment: string; title: string };
  A: { equipment: string; title: string };
  C: { equipment: string; title: string };
  E: { equipment: string; title: string };
  activePlans: string[];
  lastUpdated: string;
}

const PacePlanBanner = () => {
  const [pacePlan, setPacePlan] = useState<PacePlan>({
    P: { equipment: "", title: "Primary" },
    A: { equipment: "", title: "Alternate" },
    C: { equipment: "", title: "Contingency" },
    E: { equipment: "", title: "Emergency" },
    activePlans: ["P"],
    lastUpdated: new Date().toISOString(),
  });
  const { isConnected, error, socket } = useSocket();
  const { eventsSocket } = useEventsSocket();
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

  function handleChange(
    pacePlanLetter: PacePlanLetter,
    isActive: boolean,
    equipment: string
  ) {
    const updatedPacePlan = { ...pacePlan };
    emitUpdatedPacePlanEventItem(
      pacePlanLetter,
      pacePlan[pacePlanLetter].equipment,
      equipment,
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
    updatedPacePlan[pacePlanLetter].equipment = equipment;
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
        `Updated ${pacePlan[pacePlanLetter].title} equipment to ${equipment}`
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
        } equipment ${equipment}`
      );
    } else {
      console.log("No change in activity status:", oldIsActive, isActive);
    }
  }
  function emitEventItem(
    level: EventLogLevel,
    category: string,
    message: string
  ) {
    eventsSocket?.emit("newEventItem", {
      id: new Date().toISOString(),
      level,
      category,
      message,
      author: "System",
      isUserGenerated: false,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <div>
      {isConnected ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center" // center the items horizontally
          sx={{ width: "100%" }}
        >
          <PacePlanLetter
            letter="P"
            equipment={pacePlan.P.equipment}
            isActive={pacePlan.activePlans.includes("P")}
            color={green[500]}
            handleChange={(isActive, equipment) =>
              handleChange("P", isActive, equipment)
            }
          />
          <PacePlanLetter
            letter="A"
            equipment={pacePlan.A.equipment}
            isActive={pacePlan.activePlans.includes("A")}
            color={yellow[500]}
            handleChange={(isActive, equipment) =>
              handleChange("A", isActive, equipment)
            }
          />
          <PacePlanLetter
            letter="C"
            equipment={pacePlan.C.equipment}
            isActive={pacePlan.activePlans.includes("C")}
            color={orange[500]}
            handleChange={(isActive, equipment) =>
              handleChange("C", isActive, equipment)
            }
          />
          <PacePlanLetter
            letter="E"
            equipment={pacePlan.E.equipment}
            isActive={pacePlan.activePlans.includes("E")}
            color={red[500]}
            handleChange={(isActive, equipment) =>
              handleChange("E", isActive, equipment)
            }
          />
        </Stack>
      ) : (
        <InlineLoading />
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default PacePlanBanner;
