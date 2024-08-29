import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = [];

// Get the collection
async function getIssuesCollection() {
  const db = await connectToMongo();
  return db.collection("issues");
}

// Reset data
export async function resetData() {
  const collection = await getIssuesCollection();
  await collection.drop();
}

// Get all issues
export async function getIssues() {
  const collection = await getIssuesCollection();
  return await collection.find({}).toArray();
}

// Add an issue
export async function addIssue(issue) {
  const collection = await getIssuesCollection();
  await collection.insertOne(issue);
}

// Update an issue
export async function updateIssue(id, updateData) {
  const { _id: _, ...updateFields } = updateData; // Exclude the `_id` field from `updateData`
  const collection = await getIssuesCollection();
  await collection.updateOne({ id: id }, { $set: updateFields });
}

// Delete an issue
export async function deleteIssue(id) {
  const collection = await getIssuesCollection();
  await collection.deleteOne({ id: id });
}

export default {
  resetData,
  getIssues,
  addIssue,
  updateIssue,
  deleteIssue,
};
