import express from 'express';
import {
  getControlCategory,
  createControlCategory,
  updateControlCategory,
  deleteControlCategory
} from '../controllers/controlCategory.controller.js';

const router = express.Router();

router.get('/', getControlCategory);

router.post('/', createControlCategory);

router.put('/:id', updateControlCategory);

router.delete('/:id', deleteControlCategory);

export default router;