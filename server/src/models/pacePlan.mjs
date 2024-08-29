import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  P: { equipmentName: "", title: "Primary" },
  A: { equipmentName: "", title: "Primary" },
  C: { equipmentName: "", title: "Primary" },
  E: { equipmentName: "", title: "Primary" },
  activePlans: [""],
  lastUpdated: new Date().toISOString(),
};

// Get the collection
async function getPacePlanCollection() {
  const db = await connectToMongo();
  return db.collection("pacePlan");
}

// Initialize the PACE plan collection with default data if it doesn't exist
async function initializePacePlanCollection() {
  const collection = await getPacePlanCollection();
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne(defaultData);
  }
}

// Reset data
export async function resetData() {
  const collection = await getPacePlanCollection();
  await collection.drop();
}

// Get PACE plan data
export async function getPacePlanData() {
  const collection = await getPacePlanCollection();
  return await collection.findOne({});
}

// Update PACE plan data
export async function updatePacePlanData(newData) {
  const { _id: _, ...updateFields } = newData; // Exclude the `_id` field from `updateData`
  const collection = await getPacePlanCollection();
  await collection.updateOne({}, { $set: updateFields });
}

// Initialize the collection with default data if empty
initializePacePlanCollection();

export default {
  resetData,
  getPacePlanData,
  updatePacePlanData,
};
