import mongoose from 'mongoose';

const controlSchema = new mongoose.Schema({
  isoControlRefs: [{ type: String, required: true }],           
  cicRegulationRefs: [{ type: String, required: true }],       
  controlName: { type: String, required: true },                
  auditObjectiveSummary: { type: String, required: true },     
  riskLevel: { 
    type: String, 
    required: true,
    enum: ['low', 'medium', 'high', 'critical']                 
  },
  auditFrequency: { 
    type: String, 
    required: true,
    enum: ['Quarterly', 'Half-Yearly', 'Yearly']                
  },
  department: [{ type: String, required: true }],              
  keyOwner: { type: String, required: true },                  
  keyEvidenceToBeVerified: [{ type: String, required: true }],  
  evidenceAttached: [{ type: String }],                      
  auditorComment: { type: String },                    
}, { timestamps: true });

const Control = mongoose.model('Control', controlSchema);
export default Control;