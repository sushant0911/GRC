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
    const { name, description } = req.body;

    const category = new ControlCategory({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error.message); 
    res.status(400).json({ error: "Bad Request" });
  }
};

export const updateControlCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await ControlCategory.findByIdAndUpdate(
      id,
      { name, description },
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