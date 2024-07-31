import {
  getEventLogs,
  addEventLog,
  updateEventLog,
  deleteEventLog,
} from "../models/eventLog.mjs";
import { getPacePlanData, updatePacePlanData } from "../models/pacePlan.mjs";
import {
  getEquipmentGroups,
  updateEquipmentGroup,
} from "../models/equipment.mjs";
import pingService from "../services/pingService.mjs";
import { getPersonnelData, updatePersonnelData } from "../models/personnel.mjs";
import { getFpconData, updateFpconData } from "../models/fpcon.mjs";
import {
  getIssues,
  addIssue,
  updateIssue,
  deleteIssue,
} from "../models/issues.mjs";
import {
  getScratchpadData,
  updateScratchpadData,
} from "../models/scratchpad.mjs";

let pacePlanNamespace;
let eventItemsNamespace;
let equipmentGroupsNamespace;
let pingStatusNamespace;
let fpconNamespace;
let personnelLocationsNamespace;
let scratchpadNamespace;
let issuesNamespace;

export function setupSockets(io) {
  pacePlanNamespace = io.of("/pacePlan");
  eventItemsNamespace = io.of("/events");
  equipmentGroupsNamespace = io.of("/equipmentGroups");
  pingStatusNamespace = io.of("/pingPong");
  fpconNamespace = io.of("/fpcon");
  personnelLocationsNamespace = io.of("/personnelLocations");
  scratchpadNamespace = io.of("/scratchpad");
  issuesNamespace = io.of("/issues");

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected from root");
    });
  });

  // Pace Plan Namespace
  pacePlanNamespace.on("connect", async (socket) => {
    console.log("New client connected to Pace Plan namespace");
    const pacePlan = await getPacePlanData();
    socket.emit("pacePlan", pacePlan);
    socket.on("pacePlan", async (data) => {
      console.log("Pace Plan update received:", data);
      await updatePacePlanData(data);
      pacePlanNamespace.emit("pacePlan", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Pace Plan namespace");
    });
  });

  // Equipment Group Namespace
  equipmentGroupsNamespace.on("connect", async (socket) => {
    console.log("New client connected to Pace Plan namespace");
    const equipmentGroups = await getEquipmentGroups();
    socket.emit("equipmentGroups", equipmentGroups);
    socket.on("equipmentGroups", async (data) => {
      console.log("Equipment Groups update received:", data);
      const { id } = data;
      await updateEquipmentGroup(id, data);
      equipmentGroupsNamespace.emit("equipmentGroupsUpdated", data);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected from Equipment Groups namespace");
    });
  });

  // Event Items Namespace
  eventItemsNamespace.on("connect", async (socket) => {
    console.log("New client connected to Event Logs namespace");

    const eventLogs = await getEventLogs();
    console.log("Event Items sent to client:", eventLogs);
    socket.emit("eventItems", eventLogs);

    socket.on("newEventItem", async (data) => {
      console.log("Event Item received:", data);
      addEventLog(data);
      eventItemsNamespace.emit("newEventItem", data);
    });

    socket.on("updateEventItem", async (data) => {
      const { id } = data;
      console.log("Event Item update received:", data);
      await updateEventLog(id, data);
      eventItemsNamespace.emit("updateEventItem", data);
    });

    socket.on("deleteEventItem", async (data) => {
      console.log("Event Item delete received:", data);
      const { id } = data;
      await deleteEventLog(id);
      eventItemsNamespace.emit("deleteEventItem", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Event Items namespace");
    });
  });

  // Ping Status Namespace
  pingStatusNamespace.on("connect", (socket) => {
    console.log("New client connected to Ping Status namespace");

    socket.on("addService", ({ serviceID, pingPong }) => {
      console.log("Add service request for service ID:", serviceID, pingPong);
      const service = {
        serviceId: serviceID,
        hostname: pingPong.hostname,
      };
      pingService.addService(service);
    });

    socket.on("ping", (serviceID) => {
      console.log("Ping received for service ID:", serviceID);
      const service = pingService.getService(serviceID);
      socket.emit("pong", service);
    });

    socket.on("removeService", (serviceID) => {
      console.log("Remove service request for service ID:", serviceID);
      pingService.removeService(serviceID);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Ping Status namespace");
    });
  });

  // FPCon Namespace
  fpconNamespace.on("connect", async (socket) => {
    console.log("New client connected to FPCon namespace");

    const fpconData = await getFpconData();
    socket.emit("fpcon", fpconData);

    socket.on("fpcon", async (data) => {
      await updateFpconData(data);
      fpconNamespace.emit("fpcon", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from FPCon namespace");
    });
  });

  // Personnel Locations Namespace
  personnelLocationsNamespace.on("connect", async (socket) => {
    console.log("New client connected to Personnel Locations namespace");

    const personnelDB = await getPersonnelData();
    socket.emit("personnelLocations", personnelDB.locations);

    socket.on("personnelLocations", async (data) => {
      const personnelDB = await getPersonnelData();
      personnelDB.locations = data;
      await updatePersonnelData(personnelDB);
      personnelLocationsNamespace.emit("personnelLocations", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Personnel Locations namespace");
    });
  });

  // Scratchpad Namespace
  scratchpadNamespace.on("connect", async (socket) => {
    console.log("New client connected to Scratchpad namespace");

    const scratchpad = await getScratchpadData();
    socket.emit("scratchpad", scratchpad);

    socket.on("scratchpad", async (data) => {
      await updateScratchpadData(data);
      scratchpadNamespace.emit("scratchpad", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Scratchpad namespace");
    });
  });

  // Issues Namespace
  issuesNamespace.on("connect", async (socket) => {
    console.log("New client connected to Issues namespace");

    const issues = await getIssues();
    socket.emit("issues", issues);

    socket.on("newIssue", async (data) => {
      await addIssue(data);
      issuesNamespace.emit("newIssue", data);
    });

    socket.on("updateIssue", async (data) => {
      const { id } = data;
      await updateIssue(id, data);
      issuesNamespace.emit("updateIssue", data);
    });

    socket.on("deleteIssue", async (data) => {
      const { id } = data;
      await deleteIssue(id);
      issuesNamespace.emit("deleteIssue", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Issues namespace");
    });
  });
}

export function getEventItemsNamespace() {
  return eventItemsNamespace;
}

export function getEquipmentGroupsNamespace() {
  return equipmentGroupsNamespace;
}

export function getPacePlanNamespace() {
  return pacePlanNamespace;
}

export function getPingStatusNamespace() {
  return pingStatusNamespace;
}

export function getPersonnelLocationsNamespace() {
  return personnelLocationsNamespace;
}

export function getScratchpadNamespace() {
  return scratchpadNamespace;
}
