// index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

const app = express();

// ——————————————
// 1) CORS
// ——————————————
const allowedOrigins = [
  'http://localhost:5173',
  process.env.NETLIFY_URL, // e.g. https://phenomenal-kitten-2fb0cd.netlify.app
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);                // allow non-browser clients
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
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    secure: process.env.NODE_ENV === 'development' ? false : true,
     maxAge:   Number(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 24,
    // no `domain` here — defaults to your API’s host
  },
};

if (process.env.NODE_ENV !== 'development') {
  app.set('trust proxy', 1);   // enable secure cookies behind a proxy/load-balancer
}

app.use(session(sessionOptions));

// ——————————————
// 3) ROUTES & STARTUP
// ——————————————
app.use(express.json());

UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
