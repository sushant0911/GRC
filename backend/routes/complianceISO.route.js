import { Router } from "express";
import {
  createComplianceISO,
  getAllComplianceISO,
  getComplianceISO,
  updateComplianceISO,
  deleteComplianceISO,
} from "../controllers/complianceISO.controller.js";

const router = Router();

router.post("/", createComplianceISO);
router.get("/", getAllComplianceISO);
router.get("/:id", getComplianceISO);
router.put("/:id", updateComplianceISO);
router.delete("/:id", deleteComplianceISO);

export default router;