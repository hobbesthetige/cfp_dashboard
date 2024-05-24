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

    socket.on("disconnect", () => {
      console.log("Client disconnected from Event Items namespace");
    });
  });
};
