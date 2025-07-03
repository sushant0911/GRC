import mongoose from 'mongoose';
import { getComplianceEnum, refreshComplianceEnum } from '../utils/dynamicEnums.js';

const controlSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ControlCategory',
    required: true,
  },
  controlName: { 
    type: String, 
    required: true,
    trim: true
  },
  auditObjectiveSummary: { 
    type: String, 
    required: true,
    trim: true 
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
  },
  auditFrequency: {
    type: String,
    required: true,
    enum: ['Quarterly', 'Half-Yearly', 'Yearly'],
  },
  departments: [
    {
      department: { 
        type: String, 
        required: false,
        trim: true 
      },
      keyOwner: { 
        type: String, 
        required: false,
        trim: true 
      },
    }
  ],
  keyEvidenceToBeVerified: [{ 
    type: String, 
    required: true,
    trim: true 
  }],
  complianceReferences: [
    {
      compliance: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        enum: getComplianceEnum(),
        validate: {
          validator: async function(v) {
            const validCompliances = await refreshComplianceEnum();
            return validCompliances.includes(v.toUpperCase());
          },
          message: props => `${props.value} is not a valid compliance standard`
        } 
      },
      controlNo: { 
        type: String, 
        required: true,
        uppercase: true,
        trim: true
      },
      controlName: { 
        type: String, 
        required: true,
        trim: true
      }
    }
  ],
  evidenceAttached: [{ 
    type: String,
    trim: true 
  }],
  auditorComment: { 
    type: String,
    trim: true 
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Initialize the enum cache when model loads
// refreshComplianceEnum().catch(err => {
//   console.error('Failed to initialize compliance enum:', err);
// });

const Compliance = mongoose.model('Compliance');
// if (Compliance) {
//   Compliance.watch().on('change', async () => {
//     try {
//       await refreshComplianceEnum();
//     } catch (err) {
//       console.error('Error refreshing compliance enum:', err);
//     }
//   });
// } else {
//   console.warn('Compliance model not found - enum refresh watcher not initialized');
// }

const Control = mongoose.model('Control', controlSchema);
export default Control;