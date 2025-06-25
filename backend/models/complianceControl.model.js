import mongoose from 'mongoose';

const controlSchema = new mongoose.Schema({
  controlRef: { type: String, required: true, unique: true },
  controlName: { type: String, required: true },
  description: String,
  compliance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Compliance',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ControlCategory',
    required: true,
    default: '685a5a36fce00d9901b2ab59'
  }
}, { timestamps: true });

export default mongoose.model('Control', controlSchema);
