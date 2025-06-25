import express from 'express';
import connectDB from './lib/db.js';
import controlRoutes from './routes/control.route.js';
import controlCategoryRoutes from './routes/controlCategory.route.js';
// import referenceRoutes from './routes/reference.route.js';
import complianceRouter from './routes/compliance.route.js';

import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/controls', controlRoutes);
app.use('/api/control-categories', controlCategoryRoutes);
app.use('/api/compliances', complianceRouter);
// app.use('/api', referenceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


