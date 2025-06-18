import ControlCategory from '../models/controlCategory.model.js';

export const getControlCategory = async (req, res) => {
  try {
    const categories = await ControlCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createControlCategory = async (req, res) => {
  try {
    console.log("Incoming POST body:", req.body); // Debugging line
    const { compliance, name, description } = req.body;

    const category = new ControlCategory({ compliance, name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error.message); // Debugging line

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name must be unique." });
    }

    res.status(400).json({ error: "Bad Request" });
  }
};

export const updateControlCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { compliance, name, description } = req.body;
    const updated = await ControlCategory.findByIdAndUpdate(
      id,
      { compliance, name, description },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteControlCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ControlCategory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};