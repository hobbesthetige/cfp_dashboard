import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import { getEventLogs } from "../models/eventLog.mjs";
const router = express.Router();

// Get endpoint
router.get("/events", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const events = await getEventLogs();
  res.status(200).json(events);
});

async function getUniqueCategories() {
  const categories = new Set();
  const events = await getEventLogs();
  if (!events || events.length === 0) { return []; }
  events.forEach((event) => categories.add(event.category));
  return Array.from(categories);
}

async function getEarliestEvent() {
  const events = await getEventLogs();
  if (!events || events.length === 0) { return null; }
  return events.reduce((earliest, event) => {
    const eventDate = new Date(event.timestamp);
    const earliestDate = new Date(earliest.timestamp);
    return eventDate < earliestDate ? event : earliest;
  });
}

async function getLatestEvent() {
  const events = await getEventLogs();
  if (!events || events.length === 0) { return null; }
  return events.reduce((latest, event) => {
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
    categories: await getUniqueCategories(),
    earliest: await getEarliestEvent(),
    latest: await getLatestEvent(),
  });
});

export default router;
