import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';

import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

// Use your Atlas URI env var name (or fall back to local)
const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/kambaz';

const PORT = process.env.PORT || 4000;
console.log('🔗 Connecting to MongoDB with URI:', CONNECTION_STRING);
// First, connect to MongoDB Atlas
mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Only start Express once DB is up
    const app = express();

    const allowedOrigins = [
      'http://localhost:5173',
      process.env.NETLIFY_URL,
      'https://phenomenal-kitten-2fb0cd.netlify.app',
    ];

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          callback(new Error(`CORS policy: origin ${origin} not allowed`));
        },
        credentials: true,
      })
    );

    const sessionOptions = {
      secret: process.env.SESSION_SECRET || 'kambaz',
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite:
          process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        secure:
          process.env.NODE_ENV === 'development' ? false : true,
        maxAge:
          Number(process.env.SESSION_MAX_AGE) ||
          1000 * 60 * 60 * 24,
      },
    };

    if (process.env.NODE_ENV !== 'development') {
      app.set('trust proxy', 1);
    }

    app.use(session(sessionOptions));
    app.use(express.json());

    EnrollmentRoutes(app);
    UserRoutes(app);
    CourseRoutes(app);
    ModuleRoutes(app);
    AssignmentRoutes(app);
    Lab5(app);
    Hello(app);

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
