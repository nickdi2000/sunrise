import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoUrl = process.env.MONGODB_URL;
const dbName = 'sunriseyouth';

class Database {
  constructor() {
    this.client = null;
  }

  async connect() {
    console.log('[DEBUG] Attempting MongoDB connection...');
    console.log('[DEBUG] MongoDB URL configured:', mongoUrl ? 'Yes' : 'No');
    
    if (!mongoUrl) {
      throw new Error("[ERROR] MONGODB_URL not set in environment variables");
    }
    
    try {
      console.log('[DEBUG] Creating MongoDB client...');
      this.client = new MongoClient(mongoUrl, {
        ignoreUndefined: true,
        serverSelectionTimeoutMS: 3000,
      });
      
      console.log('[DEBUG] Attempting to connect...');
      await this.client.connect();
      
      console.log('[DEBUG] Running ping command...');
      await this.client.db("admin").command({ ping: 1 });
      
      console.log('[SUCCESS] Connected to MongoDB');
      
      // Test access to the content collection
      try {
        const db = this.client.db(dbName);
        await db.collection('content').findOne({ _id: 'landing' });
        console.log('[DEBUG] Successfully tested content collection access');
      } catch (collectionErr) {
        console.error('[ERROR] Failed to access content collection:', collectionErr.message);
        throw collectionErr;
      }
    } catch (err) {
      console.error("[ERROR] Failed to connect to MongoDB:", err.message);
      if (err.stack) {
        console.error("[ERROR] Stack trace:", err.stack);
      }
      throw err;
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.client;
  }

  getDb() {
    if (!this.client) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.client.db(dbName);
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('[INFO] Disconnected from MongoDB');
    }
  }
}

// Create and export a singleton instance
const database = new Database();
export default database;

