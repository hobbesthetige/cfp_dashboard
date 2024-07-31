import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  currentState: {
    id: "1",
    name: "Normal",
    color: "success",
    description:
      "Applies when a general global threat of possible terrorist threat activity exists and warrants a routine security posture.",
  },
  lastUpdated: new Date().toISOString(),
  history: [],
};

// Get the collection
async function getFpconCollection() {
  const db = await connectToMongo();
  return db.collection("fpcon");
}

// Initialize the FPCON collection with default data if it doesn't exist
async function initializeFpconCollection() {
  const collection = await getFpconCollection();
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne(defaultData);
  }
}

// Reset data
export async function resetData() {
  const collection = await getFpconCollection();
  await collection.drop();
}

// Get FPCON data
export async function getFpconData() {
  const collection = await getFpconCollection();
  return await collection.findOne({});
}

// Update FPCON data
export async function updateFpconData(newData) {
  const { _id: _, ...updateFields } = newData; // Exclude the `_id` field from `updateData`
  const collection = await getFpconCollection();
  await collection.updateOne({}, { $set: updateFields });
}

// Initialize the collection with default data if empty
initializeFpconCollection();

export default {
  resetData,
  getFpconData,
  updateFpconData,
};
