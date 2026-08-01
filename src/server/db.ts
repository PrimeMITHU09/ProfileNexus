import mongoose from 'mongoose';
import dns from 'node:dns';

// Force Node.js to use Google & Cloudflare DNS servers for resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore DNS set errors if restricted
}

export interface DbStatus {
  isConnected: boolean;
  uri: string;
  connectedAt?: string;
  error?: string;
}

let dbState: DbStatus = {
  isConnected: false,
  uri: '',
};

export async function connectToDatabase(mongoDbUri: string): Promise<DbStatus> {
  const maskedUri = mongoDbUri.replace(/\/\/(.*?)@/, '//***:***@');
  console.log(`📡 [MongoDB] Connecting to MongoDB Atlas: ${maskedUri}...`);

  try {
    if (mongoose.connection.readyState >= 1) {
      dbState = {
        isConnected: true,
        uri: maskedUri,
        connectedAt: new Date().toISOString(),
      };
      return dbState;
    }

    // Set bufferTimeout to false so Mongoose doesn't hang operations when offline
    mongoose.set('bufferTimeoutMS', 3000);

    await mongoose.connect(mongoDbUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4, // Use IPv4 to prevent IPv6 timeout issues
    });

    dbState = {
      isConnected: true,
      uri: maskedUri,
      connectedAt: new Date().toISOString(),
    };
    console.log(`✅ [MongoDB Atlas] Connected successfully at ${dbState.connectedAt}`);
    return dbState;
  } catch (error: any) {
    dbState = {
      isConnected: false,
      uri: maskedUri,
      error: error.message || 'Failed to connect to MongoDB Atlas',
    };
    console.warn(`⚠️ [MongoDB Atlas] Notice: ${error.message}. System operational with hybrid storage engine.`);
    return dbState;
  }
}

export function getDatabaseStatus(): DbStatus {
  return dbState;
}
