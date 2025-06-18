import Control from '../models/control.model.js';

// Create a new control
export const createControl = async (req, res) => {
  try {
    const control = new Control(req.body);
    await control.save();
    res.status(201).json(control);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createBulkControls = async (req, res) => {
  try {
    const controls = req.body.controls;
    // Optionally validate controls here
    const result = await Control.insertMany(controls);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all controls
export const getControls = async (req, res) => {
  try {
    const controls = await Control.find();
    res.status(200).json(controls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single control by ID
export const getControlById = async (req, res) => {
  try {
    const control = await Control.findById(req.params.id);
    if (!control) {
      return res.status(404).json({ error: 'Control not found' });
    }
    res.status(200).json(control);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a control by ID
export const updateControl = async (req, res) => {
  try {
    const control = await Control.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!control) {
      return res.status(404).json({ error: 'Control not found' });
    }
    res.status(200).json(control);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a control by ID
export const deleteControl = async (req, res) => {
  try {
    const control = await Control.findByIdAndDelete(req.params.id);
    if (!control) {
      return res.status(404).json({ error: 'Control not found' });
    }
    res.status(200).json({ message: 'Control deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};