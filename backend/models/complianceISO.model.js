import mongoose from "mongoose";

const ComplianceISOSchema = new mongoose.Schema({
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ControlCategory", required: true },
  controlName: { type: String, required: true },
  isoControlRef: { type: String, required: true }
});

const ComplianceISO = mongoose.model("ComplianceISO", ComplianceISOSchema);
export default ComplianceISO;