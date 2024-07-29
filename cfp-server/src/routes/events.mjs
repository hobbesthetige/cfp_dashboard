import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import eventsDB from "../models/eventLog.mjs";
const router = express.Router();

// Get endpoint
router.get("/events", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  res.status(200).json(eventsDB.data);
});

function getUniqueCategories() {
  const categories = new Set();
  eventsDB.data.forEach((event) => categories.add(event.category));
  return Array.from(categories);
}

function getEarliestEvent() {
  return eventsDB.data.reduce((earliest, event) => {
    const eventDate = new Date(event.timestamp);
    const earliestDate = new Date(earliest.timestamp);
    return eventDate < earliestDate ? event : earliest;
  });
}

function getLatestEvent() {
  return eventsDB.data.reduce((latest, event) => {
    const eventDate = new Date(event.timestamp);
    const latestDate = new Date(latest.timestamp);
    return eventDate > latestDate ? event : latest;
  });
}

// Get MSL Settings endpoint
router.get("/events/mslEventParameters", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  res.status(200).json({
    categories: getUniqueCategories(),
    earliest: getEarliestEvent(),
    latest: getLatestEvent(),
  });
});

export default router;
