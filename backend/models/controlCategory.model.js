import mongoose from 'mongoose';

const controlCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('ControlCategory', controlCategorySchema);