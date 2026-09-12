import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parses a string or object into a valid MongoDB ObjectId
const parseObjectId = (val) => {
  if (!val) return null;
  if (val instanceof mongoose.Types.ObjectId) return val;
  if (typeof val === 'string' && mongoose.Types.ObjectId.isValid(val)) {
    return new mongoose.Types.ObjectId(val);
  }
  if (typeof val === 'object' && val._id) {
    return parseObjectId(val._id);
  }
  return null;
};

// Connects to MongoDB and seeds demo categories and simple products
const restoreDemoDb = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/demo-store';
  console.log('Connecting to MongoDB at', mongoUri);

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    const db = mongoose.connection.db;

    const categoriesFile = path.join(__dirname, '../data/demoCategories.json');
    if (fs.existsSync(categoriesFile)) {
      const raw = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
      const catList = raw.data || raw;
      if (Array.isArray(catList) && catList.length > 0) {
        console.log(`Seeding ${catList.length} categories...`);
        const catCol = db.collection('categories');
        await catCol.deleteMany({});
        const docs = catList.map((c) => {
          const doc = { ...c };
          if (doc._id) doc._id = parseObjectId(doc._id) || new mongoose.Types.ObjectId();
          if (doc.parent) {
            doc.parent = parseObjectId(doc.parent);
          } else {
            doc.parent = null;
          }
          if (doc.createdBy) doc.createdBy = parseObjectId(doc.createdBy);
          if (doc.updatedBy) doc.updatedBy = parseObjectId(doc.updatedBy);
          doc.createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
          doc.updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
          return doc;
        });
        await catCol.insertMany(docs);
        console.log('Categories seeded successfully.');
      }
    }

    const productsFile = path.join(__dirname, '../data/demoProducts.json');
    if (fs.existsSync(productsFile)) {
      const raw = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
      const prodList = raw.data || raw;
      if (Array.isArray(prodList) && prodList.length > 0) {
        console.log(`Seeding ${prodList.length} simple products...`);
        const prodCol = db.collection('products');
        await prodCol.deleteMany({});
        const docs = prodList.map((p) => {
          const doc = { ...p };
          if (doc._id || doc.id) {
            doc._id = parseObjectId(doc._id || doc.id) || new mongoose.Types.ObjectId();
          }
          if (Array.isArray(doc.categories)) {
            doc.categories = doc.categories.map((cat) => {
              const cDoc = { ...cat };
              if (cDoc._id) cDoc._id = parseObjectId(cDoc._id) || new mongoose.Types.ObjectId();
              if (cDoc.parent) cDoc.parent = parseObjectId(cDoc.parent);
              return cDoc;
            });
          }
          if (doc.createdBy) doc.createdBy = parseObjectId(doc.createdBy);
          if (doc.updatedBy) doc.updatedBy = parseObjectId(doc.updatedBy);
          doc.createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
          doc.updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
          return doc;
        });
        await prodCol.insertMany(docs);
        console.log('Products seeded successfully.');
      }
    }
  } catch (error) {
    console.error('Error during demo db restore:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

restoreDemoDb();
