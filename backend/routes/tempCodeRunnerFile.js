import express from 'express';
import {
  createControl,
  getControls,
  getControlById,
  updateControl,
  deleteControl
} from '../controllers/control.controller.js';

const router = express.Router();

router.post('/', createControl);
router.get('/', getControls);
router.get('/:id', getControlById);
router.put('/:id', updateControl);
router.delete('/:id', deleteControl);

export default router;