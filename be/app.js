import express from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { fileURLToPath } from "node:url";
import path from "node:path";
import cors from "cors";
import jwt from "jsonwebtoken";
import database from "./config/database.js";
import Message from "./models/Message.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 3033;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to parse JSON bodies
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5144', 'https://sunriseyouth.com', 'https://www.sunriseyouth.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'Content-Type', 'DNT', 'If-Modified-Since', 'Keep-Alive', 'Origin', 'User-Agent', 'X-Requested-With']
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// Create API router
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Error response helper
const sendErrorResponse = (res, status, message, details = null) => {
  const errorResponse = {
    error: {
      message,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      status
    }
  };
  
  if (details) {
    errorResponse.error.details = details;
  }
  
  res.status(status).json(errorResponse);
};

// Success response helper
const sendSuccessResponse = (res, data, message = null) => {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    data
  };

  if (message) {
    response.message = message;
  }

  res.json(response);
};

apiRouter.get("/health", async (req, res) => {
  try {
    let mongoConnected = false;
    const client = database.getClient();
    if (client) {
      await client.db("admin").command({ ping: 1 });
      mongoConnected = true;
    }
    sendSuccessResponse(res, { mongoConnected }, "API is up and running");
  } catch (e) {
    sendSuccessResponse(res, { mongoConnected: false }, "API is up but database is not connected");
  }
});

// Authentication middleware (temporarily disabled)
const authenticateToken = (req, res, next) => {
  // Temporarily pass through all requests
  next();
};

// Login endpoint
apiRouter.post('/auth/login', async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return sendErrorResponse(res, 400, "Password is required");
  }
  
  // Simple hardcoded password for development
  if (password === 'gorepando') {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    sendSuccessResponse(res, { token }, "Login successful");
  } else {
    sendErrorResponse(res, 401, "Invalid password");
  }
});

// Get content endpoint (public)
apiRouter.get('/content', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}][INFO] Content endpoint hit`, {
    method: req.method,
    path: req.path,
    query: req.query
  });

  try {
    // Check database connection
    if (!database.getClient()) {
      console.error(`[${requestId}][ERROR] Database connection not available`);
      return sendErrorResponse(res, 503, "Database service unavailable");
    }

    const db = database.getDb();
    
    // Validate database access
    try {
      await db.command({ ping: 1 });
    } catch (pingError) {
      console.error(`[${requestId}][ERROR] Database ping failed:`, pingError);
      return sendErrorResponse(res, 503, "Database service not responding");
    }
    
    console.log(`[${requestId}][DEBUG] Attempting to find content document...`);
    const content = await db.collection('content').findOne({ _id: 'landing' });
    
    if (!content) {
      console.log(`[${requestId}][INFO] No content found`);
      return sendSuccessResponse(res, { _metadata: { error: "No content available" } }, "No content available");
    }

    if (!content.data) {
      console.log(`[${requestId}][WARN] Content found but data field is missing`);
      return sendSuccessResponse(res, { _metadata: { error: "Content structure is invalid" } }, "Content structure is invalid");
    }

    console.log(`[${requestId}][INFO] Content retrieved successfully`);
    // Send just the content data directly, with metadata at the root level
    sendSuccessResponse(res, {
      ...content.data,
      _metadata: {
        lastUpdated: content.updatedAt || null,
        id: content._id
      }
    });
  } catch (error) {
    console.error(`[${requestId}][ERROR] Failed to fetch content:`, {
      error: error.message,
      stack: error.stack,
      code: error.code
    });

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      return sendErrorResponse(res, 500, "Database error occurred", {
        code: error.code,
        type: "database_error"
      });
    }

    if (error.name === 'MongoNetworkError') {
      return sendErrorResponse(res, 503, "Database network error", {
        type: "network_error"
      });
    }

    sendErrorResponse(res, 500, "Internal server error", {
      type: "unknown_error"
    });
  }
});

// Update content endpoint (protected)
apiRouter.put('/content', authenticateToken, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}][INFO] Update content request received`);

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendErrorResponse(res, 400, "Content data is required");
    }

    const db = database.getDb();
    const content = req.body;

    // Validate database connection
    try {
      await db.command({ ping: 1 });
    } catch (pingError) {
      return sendErrorResponse(res, 503, "Database service not responding");
    }

    // Upsert the content with _id: 'landing'
    const result = await db.collection('content').updateOne(
      { _id: 'landing' },
      { 
        $set: { 
          data: content,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`[${requestId}][INFO] Content updated successfully`, {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });

    sendSuccessResponse(res, {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    }, "Content updated successfully");
  } catch (error) {
    console.error(`[${requestId}][ERROR] Failed to update content:`, {
      error: error.message,
      stack: error.stack
    });

    if (error.name === 'MongoServerError') {
      return sendErrorResponse(res, 500, "Database error occurred", {
        code: error.code,
        type: "database_error"
      });
    }

    sendErrorResponse(res, 500, "Failed to update content", {
      type: "unknown_error"
    });
  }
});

// Contact form submission endpoint
apiRouter.post('/contact', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}][INFO] Contact form submission received`, {
    body: { ...req.body, message: req.body.message ? `${req.body.message.substring(0, 50)}...` : undefined }
  });

  try {
    // Check if database is available
    if (!database.getClient()) {
      console.error(`[${requestId}][ERROR] Database connection not available`);
      return sendErrorResponse(res, 503, "Database service unavailable");
    }

    const db = database.getDb();

    // Validate database connection
    try {
      await db.command({ ping: 1 });
    } catch (pingError) {
      console.error(`[${requestId}][ERROR] Database ping failed:`, pingError);
      return sendErrorResponse(res, 503, "Database service not responding");
    }

    // Prepare metadata
    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      clientTimestamp: req.body.timestamp
    };

    console.log(`[${requestId}][DEBUG] Creating message with model validation...`);
    
    // Use Message model to validate and create the document
    let messageDocument;
    try {
      messageDocument = Message.create(req.body, metadata);
    } catch (validationError) {
      console.log(`[${requestId}][WARN] Message validation failed:`, validationError.message);
      return sendErrorResponse(res, 400, validationError.message);
    }

    console.log(`[${requestId}][DEBUG] Saving message to database...`);
    
    // Save to database using the model's collection name
    const result = await db.collection(Message.collectionName).insertOne(messageDocument);
    
    console.log(`[${requestId}][INFO] Message saved successfully`, {
      insertedId: result.insertedId,
      name: messageDocument.name,
      subject: Message.getSubjectLabel(messageDocument.subject),
      email: messageDocument.email
    });

    // Return success response
    sendSuccessResponse(res, {
      id: result.insertedId,
      submittedAt: messageDocument.submittedAt,
      status: messageDocument.status
    }, "Thank you for your message! We'll get back to you soon.");

  } catch (error) {
    console.error(`[${requestId}][ERROR] Failed to process contact form:`, {
      error: error.message,
      stack: error.stack
    });

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      return sendErrorResponse(res, 500, "Database error occurred", {
        code: error.code,
        type: "database_error"
      });
    }

    if (error.name === 'MongoNetworkError') {
      return sendErrorResponse(res, 503, "Database network error", {
        type: "network_error"
      });
    }

    sendErrorResponse(res, 500, "Failed to submit contact form", {
      type: "unknown_error"
    });
  }
});

// Get messages endpoint (protected - admin only)
apiRouter.get('/messages', authenticateToken, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}][INFO] Messages endpoint hit`, {
    query: req.query
  });

  try {
    // Check if database is available
    if (!database.getClient()) {
      console.error(`[${requestId}][ERROR] Database connection not available`);
      return sendErrorResponse(res, 503, "Database service unavailable");
    }

    const db = database.getDb();

    // Validate database connection
    try {
      await db.command({ ping: 1 });
    } catch (pingError) {
      console.error(`[${requestId}][ERROR] Database ping failed:`, pingError);
      return sendErrorResponse(res, 503, "Database service not responding");
    }

    // Parse query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const subject = req.query.subject;
    const sort = req.query.sort || 'submittedAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    if (status && ['new', 'read', 'responded', 'archived'].includes(status)) {
      filter.status = status;
    }
    if (subject && ['general', 'programs', 'volunteer', 'partnership', 'support', 'sponsorships', 'other'].includes(subject)) {
      filter.subject = subject;
    }

    console.log(`[${requestId}][DEBUG] Fetching messages with filter:`, {
      filter,
      page,
      limit,
      sort,
      order
    });

    // Get total count for pagination
    const totalCount = await db.collection(Message.collectionName).countDocuments(filter);
    
    // Fetch messages with pagination and sorting
    const messages = await db.collection(Message.collectionName)
      .find(filter)
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`[${requestId}][INFO] Retrieved ${messages.length} messages (${totalCount} total)`);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Format messages for frontend consumption
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      subjectLabel: Message.getSubjectLabel(msg.subject),
      message: msg.message,
      status: msg.status,
      statusLabel: Message.getStatusLabel(msg.status),
      submittedAt: msg.submittedAt,
      clientTimestamp: msg.clientTimestamp,
      ipAddress: msg.ipAddress,
      userAgent: msg.userAgent,
      adminNotes: msg.adminNotes,
      respondedAt: msg.respondedAt,
      respondedBy: msg.respondedBy
    }));

    // Return success response with messages and pagination info
    sendSuccessResponse(res, {
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        status,
        subject,
        sort,
        order: order === 1 ? 'asc' : 'desc'
      }
    }, `Retrieved ${messages.length} messages`);

  } catch (error) {
    console.error(`[${requestId}][ERROR] Failed to fetch messages:`, {
      error: error.message,
      stack: error.stack
    });

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      return sendErrorResponse(res, 500, "Database error occurred", {
        code: error.code,
        type: "database_error"
      });
    }

    if (error.name === 'MongoNetworkError') {
      return sendErrorResponse(res, 503, "Database network error", {
        type: "network_error"
      });
    }

    sendErrorResponse(res, 500, "Failed to fetch messages", {
      type: "unknown_error"
    });
  }
});

// Update message status endpoint (protected - admin only)
apiRouter.patch('/messages/:id/status', authenticateToken, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const messageId = req.params.id;
  const { status, adminNotes } = req.body;

  console.log(`[${requestId}][INFO] Update message status request`, {
    messageId,
    status,
    hasNotes: Boolean(adminNotes)
  });

  try {
    // Validate status
    if (!status || !['new', 'read', 'responded', 'archived'].includes(status)) {
      return sendErrorResponse(res, 400, "Invalid status. Must be one of: new, read, responded, archived");
    }

    // Check if database is available
    if (!database.getClient()) {
      console.error(`[${requestId}][ERROR] Database connection not available`);
      return sendErrorResponse(res, 503, "Database service unavailable");
    }

    const db = database.getDb();

    // Build update object
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    if (status === 'responded') {
      updateData.respondedAt = new Date();
      updateData.respondedBy = 'admin'; // TODO: Get actual admin user when auth is implemented
    }

    // Update the message (convert messageId to ObjectId for MongoDB)
    let objectId;
    try {
      objectId = new ObjectId(messageId);
    } catch (err) {
      return sendErrorResponse(res, 400, "Invalid message ID format");
    }
    
    const result = await db.collection(Message.collectionName).updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return sendErrorResponse(res, 404, "Message not found");
    }

    console.log(`[${requestId}][INFO] Message status updated successfully`, {
      messageId,
      status,
      modified: result.modifiedCount
    });

    sendSuccessResponse(res, {
      messageId,
      status,
      modified: result.modifiedCount
    }, "Message status updated successfully");

  } catch (error) {
    console.error(`[${requestId}][ERROR] Failed to update message status:`, {
      error: error.message,
      stack: error.stack
    });

    sendErrorResponse(res, 500, "Failed to update message status", {
      type: "unknown_error"
    });
  }
});

apiRouter.get("/", (req, res) => {
  sendSuccessResponse(res, null, "Webfly API");
});

// Connect to database and start server
database.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await database.disconnect().catch(() => {});
  process.exit(0);
});