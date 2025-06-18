import ComplianceISO from '../models/complianceISO.model.js';
// import ComplianceCICRA from '../models/ComplianceCICRA.js';
// import ComplianceCIBIL from '../models/ComplianceCIBIL.js';

const getComplianceModel = (complianceName) => {
  switch (complianceName) {
    case 'ISO':
      return ComplianceISO;
    // case 'CICRA':
    //   return ComplianceCICRA;
    // case 'CIBIL':
    //   return ComplianceCIBIL;
    default:
      return null;
  }
};

export const getFilteredReferences = async (req, res) => {
  const { compliance, category } = req.query;

  if (!compliance || !category) {
    return res.status(400).json({ message: 'Compliance and category are required' });
  }

  const ComplianceModel = getComplianceModel(compliance);

  if (!ComplianceModel) {
    return res.status(400).json({ message: 'Invalid compliance type' });
  }

  try {
    const references = await ComplianceModel.find({ category })
      .select('isoControlRef controlName')
      .populate('category', 'name');

    res.json(references);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
