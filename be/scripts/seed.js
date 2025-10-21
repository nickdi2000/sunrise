import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import database from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await database.connect();
    console.log('Connected successfully');

    // Read the landing.json file
    console.log('Reading landing page content...');
    const contentPath = path.join(__dirname, '../data/landing.json');
    const contentJson = await fs.readFile(contentPath, 'utf-8');
    const content = JSON.parse(contentJson);

    // Get the database
    const db = database.getDb();
    const collection = db.collection('content');

    // Upsert the content
    console.log('Upserting content...');
    await collection.updateOne(
      { _id: 'landing' },
      {
        $set: {
          data: content,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    if (database) {
      await database.disconnect();
    }
  }
}

// Run the seed function
seed();