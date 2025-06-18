import ComplianceISO from "../models/complianceISO.model.js";

// Create
export const createComplianceISO = async (req, res) => {
  try {
    const compliance = new ComplianceISO(req.body);
    await compliance.save();
    res.status(201).json(compliance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
export const getAllComplianceISO = async (req, res) => {
  const list = await ComplianceISO.find().populate("category");
  res.json(list);
};

// Read one
export const getComplianceISO = async (req, res) => {
  const compliance = await ComplianceISO.findById(req.params.id).populate("category");
  if (!compliance) return res.status(404).json({ error: "Not found" });
  res.json(compliance);
};

// Update
export const updateComplianceISO = async (req, res) => {
  try {
    const compliance = await ComplianceISO.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(compliance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteComplianceISO = async (req, res) => {
  await ComplianceISO.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};