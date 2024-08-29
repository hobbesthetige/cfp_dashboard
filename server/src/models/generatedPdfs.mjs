import { connectToMongo } from "../services/mongoService.mjs";
import { ObjectId } from "mongodb";

async function getGeneratedPdfsCollection() {
  const db = await connectToMongo();
  return db.collection("generatedPdfs");
}

async function resetData() {
  const collection = await getGeneratedPdfsCollection();
  await collection.drop();
}

async function getGeneratedPdfs() {
  const collection = await getGeneratedPdfsCollection();
  return await collection.find({}).sort({ timestamp: -1 }).toArray();
}

async function getGeneratedPdf(id) {
  const collection = await getGeneratedPdfsCollection();
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function addGeneratedPdf(entry) {
  const collection = await getGeneratedPdfsCollection();
  const { insertedId } = await collection.insertOne(entry);
  return insertedId;
}

async function updateGeneratedPdf(id, updateData) {
  const { _id: _, ...updateFields } = updateData; // Exclude the `_id` field from `updateData`
  const collection = await getGeneratedPdfsCollection();
  await collection.updateOne({ _id: id }, { $set: updateFields });
}

async function deleteGeneratedPdf(id) {
  const collection = await getGeneratedPdfsCollection();
  await collection.deleteOne({ _id: id });
}

export {
  resetData,
  getGeneratedPdf,
  getGeneratedPdfs,
  addGeneratedPdf,
  updateGeneratedPdf,
  deleteGeneratedPdf,
};
