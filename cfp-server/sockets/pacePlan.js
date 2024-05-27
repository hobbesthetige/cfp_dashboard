const pacePlanModel = require("../models/pacePlan");
const eventLogModel = require("../models/eventLog");

module.exports = (io) => {
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
    socket.emit("pacePlan", pacePlanModel.pacePlan);
    socket.on("pacePlan", (data) => {
      console.log("Pace Plan update received:", data);
      pacePlanModel.pacePlan = data;
      pacePlanNamespace.emit("pacePlanUpdated", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Pace Plan namespace");
    });
  });

  // Event Items Namespace
  eventItemsNamespace.on("connect", (socket) => {
    console.log("New client connected to Event Logs namespace");

    socket.emit("eventItems", eventLogModel.eventLogs);

    socket.on("newEventItem", (data) => {
      console.log("Event Item received:", data);
      eventLogModel.eventLogs.unshift(data);
      eventItemsNamespace.emit("newEventItem", data);
    });

    socket.on("updateEventItem", (data) => {
      console.log("Event Item update received:", data);
      const index = eventLogModel.eventLogs.findIndex(
        (item) => item.id === data.id
      );
      eventLogModel.eventLogs[index] = data;
      eventItemsNamespace.emit("updateEventItem", data);
    });

    socket.on("deleteEventItem", (data) => {
      console.log("Event Item delete received:", data);
      const index = eventLogModel.eventLogs.findIndex(
        (item) => item.id === data.id
      );
      if (index !== -1) {
        eventLogModel.eventLogs.splice(index, 1);
        eventItemsNamespace.emit("deleteEventItem", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from Event Items namespace");
    });
  });
};
