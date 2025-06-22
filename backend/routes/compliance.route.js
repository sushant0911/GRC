import express from "express";
import {
  getComplianceItems,
  createComplianceItem,
  updateComplianceItem,
  deleteComplianceItem,
} from "../controllers/compliance.controller.js";

const router = express.Router();

router.get("/:type", getComplianceItems);
router.post("/:type", createComplianceItem);
router.put("/:type/:id", updateComplianceItem);
router.delete("/:type/:id", deleteComplianceItem);

export default router;
