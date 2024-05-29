import placePlanDB from "../models/pacePlan.mjs";
import eventLogDB from "../models/eventLog.mjs";

export default (io) => {
  const pacePlanNamespace = io.of("/pacePlan");
  const eventItemsNamespace = io.of("/events");

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
      pacePlanNamespace.emit("pacePlanUpdated", data);
      await placePlanDB.write();
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Pace Plan namespace");
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
      eventLogDB.data[index] = data;
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
};
