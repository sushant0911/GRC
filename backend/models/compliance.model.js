import mongoose from 'mongoose';

const ComplianceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 20
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  controls: {
    type: Array,
    default: [] 
  }
}, { timestamps: true });

const Compliance = mongoose.model('Compliance', ComplianceSchema);
export default Compliance;