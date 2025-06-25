import Compliance from '../models/compliance.model.js'

export const getComplianceDisplayNames = async (req, res) => {
  try {
    const compliances = await Compliance.find({}, 'displayName -_id');
    
    res.status(200).json({
      success: true,
      data: compliances
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance names',
      error: error.message
    });
  }
};
export const getCompliances = async (req, res) => {
  try {
    const compliances = await Compliance.find();
    res.json(compliances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findOne({ name: req.params.name.toUpperCase() });
    if (!compliance) return res.status(404).json({ message: 'Compliance not found' });
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCompliance = async (req, res) => {
  try {
    const { name, displayName } = req.body;
    console.log(req.body);
    
    if (!name || !displayName) {
      return res.status(400).json({ 
        success: false,
        message: 'Both name and displayName are required' 
      });
    }

    const newCompliance = new Compliance({
      name: name.toUpperCase(),
      displayName
    });

    await newCompliance.save();

    res.status(201).json({
      success: true,
      data: newCompliance,
      message: 'Compliance standard created successfully'
    });

  } catch (error) {
    console.log(error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Compliance standard with this name already exists',
        field: 'name'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create compliance standard',
      error: error.message
    });
  }
};

export const updateCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findOneAndUpdate(
      { name: req.params.name.toUpperCase() },
      { $set: req.body },
      { new: true }
    );
    if (!compliance) return res.status(404).json({ message: 'Compliance not found' });
    res.json(compliance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Compliance name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findOneAndDelete({ 
      name: req.params.name.toUpperCase() 
    });
    if (!compliance) return res.status(404).json({ message: 'Compliance not found' });
    res.json({ message: 'Compliance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Control ---------------------------------

export const getControls = async (req, res) => {
  try {
    const compliance = await Compliance.findOne({ 
      name: req.params.name.toUpperCase() 
    }).populate('controls.category');
    if (!compliance) return res.status(404).json({ message: 'Compliance not found' });
    res.json(compliance.controls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getControl = async (req, res) => {
  try {
    const compliance = await Compliance.findOne({
      name: req.params.name.toUpperCase(),
      'controls._id': req.params.controlId
    }, {
      'controls.$': 1
    }).populate('controls.category');
    
    if (!compliance || !compliance.controls.length) {
      return res.status(404).json({ message: 'Control not found' });
    }
    res.json(compliance.controls[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addControl = async (req, res) => {
  try {
    const compliance = await Compliance.findOneAndUpdate(
      { name: req.params.name.toUpperCase() },
      { $push: { controls: req.body } },
      { new: true }
    ).populate('controls.category');
    
    if (!compliance) return res.status(404).json({ message: 'Compliance not found' });
    res.status(201).json(compliance.controls[compliance.controls.length - 1]);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Control reference must be unique' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateControl = async (req, res) => {
  try {
    const compliance = await Compliance.findOneAndUpdate(
      { 
        name: req.params.name.toUpperCase(),
        'controls._id': req.params.controlId 
      },
      { 
        $set: Object.fromEntries(
          Object.entries(req.body).map(([key, value]) => 
            [`controls.$.${key}`, value]
        ))
      },
      { new: true }
    ).populate('controls.category');
    
    if (!compliance) return res.status(404).json({ message: 'Control not found' });
    
    const updatedControl = compliance.controls.find(
      c => c._id.toString() === req.params.controlId
    );
    res.json(updatedControl);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Control reference must be unique' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteControl = async (req, res) => {
  try {
    const compliance = await Compliance.findOneAndUpdate(
      { name: req.params.name.toUpperCase() },
      { $pull: { controls: { _id: req.params.controlId } } },
      { new: true }
    );
    
    if (!compliance) return res.status(404).json({ message: 'Compliance not found' });
    res.json({ message: 'Control deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};