import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  services: [],
};

// Get the collection
async function getPingStatusCollection() {
  const db = await connectToMongo();
  return db.collection("pingStatus");
}

// Reset data
export async function resetData() {
  const collection = await getPingStatusCollection();
  await collection.drop();
}

// Get ping status data
export async function getPingStatusData() {
  const collection = await getPingStatusCollection();
  return await collection.findOne({});
}

// Update ping status data
export async function updatePingStatusData(newData) {
  const { _id: _, ...updateFields } = newData; // Exclude the `_id` field from `updateData`
  const collection = await getPingStatusCollection();
  await collection.updateOne({}, { $set: updateFields });
}

// Always reset this data on start
resetData();

export default {
  resetData,
  getPingStatusData,
  updatePingStatusData,
};
