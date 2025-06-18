import mongoose from 'mongoose';

const controlCategorySchema = new mongoose.Schema({
  compliance: {
    type: String,
    required: true,
    enum: ['ISO', 'CICRA', 'CIBIL']
  },
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

export default mongoose.model('ControlCategory', controlCategorySchema);
