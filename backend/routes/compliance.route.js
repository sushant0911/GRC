import express from 'express';
import {
  getComplianceDisplayNames,
  getCompliances,
  getCompliance,
  addCompliance,
  updateCompliance,
  deleteCompliance,
  getControls,
  getControl,
  addControl,
  updateControl,
  deleteControl
} from '../controllers/compliance.controller.js';

const router = express.Router();

// Compliance
router.get('/display-names', getComplianceDisplayNames);
router.get('/', getCompliances); 
router.post('/', addCompliance); 
router.get('/:name', getCompliance); 
router.put('/:name', updateCompliance);
router.delete('/:name', deleteCompliance); 

// Control 
router.get('/:name/controls', getControls); 
router.post('/:name/controls', addControl); 
router.get('/:name/controls/:controlId', getControl); 
router.put('/:name/controls/:controlId', updateControl); 
router.delete('/:name/controls/:controlId', deleteControl); 

export default router;