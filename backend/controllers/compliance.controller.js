import Compliance from "../models/compliance.model.js";

// GET all compliance items for a type
export const getComplianceItems = async (req, res) => {
  try {
    const items = await Compliance.find({ complianceType: req.params.type }).populate("category");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new compliance item
export const createComplianceItem = async (req, res) => {
  try {
    const item = new Compliance({
      complianceType: req.params.type,
      category: req.body.category,
      fields: req.body.fields,
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update compliance item
export const updateComplianceItem = async (req, res) => {
  try {
    const updated = await Compliance.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        fields: req.body.fields,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE compliance item
export const deleteComplianceItem = async (req, res) => {
  try {
    await Compliance.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
