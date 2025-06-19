import mongoose from 'mongoose';

const controlSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ControlCategory',
    required: true,
  },
  controlName: { type: String, required: true },
  auditObjectiveSummary: { type: String, required: true },
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
  },
  auditFrequency: {
    type: String,
    required: true,
    enum: ['Quarterly', 'Half-Yearly', 'Yearly'],
  },
  departments: [
    {
      department: { type: String, required: false },
      keyOwner: { type: String, required: false },
    }
  ],
  keyEvidenceToBeVerified: [{ type: String, required: true }],
  complianceReferences: [
    {
      compliance: {
        type: String,
        required: true,
        enum: ['ISO', 'CICRA', 'CIBIL'],
      },
      controlNo: {
        type: String,
        required: true,
      },
      controlName : {
        type: String,
        required: true,
      }
    }
  ],
  evidenceAttached: [{ type: String }],
  auditorComment: { type: String },
}, { timestamps: true });

const Control = mongoose.model('Control', controlSchema);
export default Control;
