import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  dashboardDefault: "",
};

// Get the collection
async function getScratchpadCollection() {
  const db = await connectToMongo();
  return db.collection("scratchpad");
}

// Initialize the scratchpad collection with default data if it doesn't exist
async function initializeScratchpadCollection() {
  const collection = await getScratchpadCollection();
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne(defaultData);
  }
}

// Reset data
export async function resetData() {
  const collection = await getScratchpadCollection();
  await collection.drop();
}

// Get scratchpad data
export async function getScratchpadData() {
  const collection = await getScratchpadCollection();
  return await collection.findOne({});
}

// Update scratchpad data
export async function updateScratchpadData(newData) {
  const { _id: _, ...updateFields } = newData; // Exclude the `_id` field from `updateData`
  const collection = await getScratchpadCollection();
  await collection.updateOne({}, { $set: updateFields });
}

// Initialize the collection with default data if empty
initializeScratchpadCollection();

export default {
  resetData,
  getScratchpadData,
  updateScratchpadData,
};
