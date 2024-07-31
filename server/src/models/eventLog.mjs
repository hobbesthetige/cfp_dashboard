import { connectToMongo } from "../services/mongoService.mjs";

const defaultData = [
  {
    id: "1",
    category: "CFP",
    title: "CFP Dashboard online",
    message: "System started",
    isUserGenerated: false,
    author: "System",
    level: "Info",
    timestamp: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

async function getEventLogCollection() {
  const db = await connectToMongo();
  return db.collection("eventLog");
}

async function resetData() {
  const collection = await getEventLogCollection();
  await collection.drop();
}

async function addEventLog(entry) {
  const collection = await getEventLogCollection();
  await collection.insertOne(entry);
}

async function getEventLogs() {
  const collection = await getEventLogCollection();
  return await collection.find({}).sort({ timestamp: -1 }).toArray();
}

async function updateEventLog(id, updateData) {
  const { _id: _, ...updateFields } = updateData; // Exclude the `_id` field from `updateData`
  const collection = await getEventLogCollection();
  await collection.updateOne({ id: id }, { $set: updateFields });
}

async function deleteEventLog(id) {
  const collection = await getEventLogCollection();
  await collection.deleteOne({ id: id });
}

export { resetData, addEventLog, getEventLogs, updateEventLog, deleteEventLog };
