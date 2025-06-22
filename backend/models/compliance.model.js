import mongoose from "mongoose";

const ComplianceSchema = new mongoose.Schema({
  complianceType: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ControlCategory", required: true },
  fields: { type: Map, of: String, required: true }, 
});

export default mongoose.model("Compliance", ComplianceSchema);
