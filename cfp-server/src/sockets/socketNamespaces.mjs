import placePlanDB from "../models/pacePlan.mjs";
import eventLogDB from "../models/eventLog.mjs";
import equipmentDB from "../models/equipment.mjs";
import pingService from "../services/pingService.mjs";
import personnelDB from "../models/personnel.mjs";
import fpconDB from "../models/fpcon.mjs";

let pacePlanNamespace;
let eventItemsNamespace;
let equipmentGroupsNamespace;
let pingStatusNamespace;
let fpconNamespace;
let personnelLocationsNamespace;

export function setupSockets(io) {
  pacePlanNamespace = io.of("/pacePlan");
  eventItemsNamespace = io.of("/events");
  equipmentGroupsNamespace = io.of("/equipmentGroups");
  pingStatusNamespace = io.of("/pingPong");
  fpconNamespace = io.of("/fpcon");
  personnelLocationsNamespace = io.of("/personnelLocations");

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected from root");
    });
  });

  // Pace Plan Namespace
  pacePlanNamespace.on("connect", (socket) => {
    console.log("New client connected to Pace Plan namespace");
    socket.emit("pacePlan", placePlanDB.data);
    socket.on("pacePlan", async (data) => {
      console.log("Pace Plan update received:", data);
      placePlanDB.data = data;
      pacePlanNamespace.emit("pacePlan", data);
      console.log("Pace Plan updated");
      await placePlanDB.write();
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Pace Plan namespace");
    });
  });

  // Equipment Group Namespace
  equipmentGroupsNamespace.on("connect", (socket) => {
    console.log("New client connected to Pace Plan namespace");
    socket.emit("equipmentGroups", equipmentDB.data.equipmentGroups);
    socket.on("equipmentGroups", async (data) => {
      console.log("Equipment Groups update received:", data);
      equipmentDB.data.equipmentGroups = data;
      equipmentGroupsNamespace.emit("equipmentGroupsUpdated", data);
      await equipmentDB.write();
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected from Equipment Groups namespace");
    });
  });

  // Event Items Namespace
  eventItemsNamespace.on("connect", (socket) => {
    console.log("New client connected to Event Logs namespace");

    socket.emit("eventItems", eventLogDB.data);

    socket.on("newEventItem", async (data) => {
      console.log("Event Item received:", data);
      eventLogDB.data.unshift(data);
      eventItemsNamespace.emit("newEventItem", data);
      await eventLogDB.write();
    });

    socket.on("updateEventItem", async (data) => {
      const { id } = data;
      console.log("Event Item update received:", data);
      const eventIndex = eventLogDB.data.findIndex((event) => event.id === id);

      if (eventIndex === -1) {
        console.error("Event not found by id: ", id);
        return;
      }
      eventLogDB.data[eventIndex] = data;
      eventItemsNamespace.emit("updateEventItem", data);
      await eventLogDB.write();
    });

    socket.on("deleteEventItem", async (data) => {
      console.log("Event Item delete received:", data);
      const { id } = data;
      const eventIndex = eventLogDB.data.findIndex((event) => event.id === id);

      if (eventIndex === -1) {
        console.error("Event not found by id: ", id);
        return;
      }
      eventLogDB.data.splice(eventIndex, 1);
      eventItemsNamespace.emit("deleteEventItem", data);
      await eventLogDB.write();
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
  fpconNamespace.on("connect", (socket) => {
    console.log("New client connected to FPCon namespace");

    socket.emit("fpcon", fpconDB.data);

    socket.on("fpcon", (data) => {
      fpconDB.data = data;
      fpconNamespace.emit("fpcon", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from FPCon namespace");
    });
  });

  // Personnel Locations Namespace
  personnelLocationsNamespace.on("connect", (socket) => {
    console.log("New client connected to Personnel Locations namespace");

    socket.emit("personnelLocations", personnelDB.data.locations);

    socket.on("personnelLocations", async (data) => {
      personnelDB.data.locations = data;
      personnelLocationsNamespace.emit("personnelLocations", data);
      await personnelDB.write();
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Personnel Locations namespace");
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
