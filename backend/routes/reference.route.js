import express from 'express';
import { getFilteredReferences } from '../controllers/reference.controller.js';

const router = express.Router();

router.get('/references', getFilteredReferences);

export default router;
