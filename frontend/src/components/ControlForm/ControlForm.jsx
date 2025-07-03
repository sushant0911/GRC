import { useState, useEffect } from "react";
import axios from "axios";
import DepartmentSection from "../DepartmentSection/DepartmentSection";
import DynamicArrayField from "../DynamicArrayField/DynamicArrayField";
import RiskAndFrequencyRow from "../RiskAndFrequencyRow/RiskAndFrequencyRow";
import ComplianceReferenceSection from "../ComplianceReferenceSection/ComplianceReferenceSection";
import "./ControlForm.css";

const initialState = {
  category: "",
  controlName: "",
  auditObjectiveSummary: "",
  riskLevel: "",
  auditFrequency: "",
  departments: [{ department: "", keyOwner: "" }],
  keyEvidenceToBeVerified: [""],
  complianceReferences: [
    {
      compliance: "",
      controlNo: "",
      controlName: "",
    },
  ],
  evidenceAttached: [""],
  auditorComment: "",
};

const ControlForm = ({ id, onSuccess }) => {
  const [formData, setFormData] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newPlus, setNewPlus] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [categoriesRes, deptRes] = await Promise.all([
          axios.get("/api/control-categories"),
          axios.get("https://beatsdemo.squareyards.com/api/Zing/GetDepartment", {
            headers: {
              API_KEY: "uAqGJ6bvNqcqsxh4TXMRHP596adeEMLVomMZywp1U0VHUeHLwHxv5jbe5Aw8=",
            },
          })
        ]);

        setCategories(categoriesRes.data);
        setDepartments(deptRes.data.Data || []);

        if (id) {
          const controlRes = await axios.get(`http://localhost:3000/api/controls/${id}`);
          setFormData(controlRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load initial data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field, idx) => {
    const newArray = [...formData[field]];
    newArray[idx] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayField = (field) => {
    if (formData[field][formData[field].length - 1]?.trim() !== "") {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const handleRemoveArrayField = (field, idx) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== idx);
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  // Department handlers
  const handleDepartmentChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDepts = formData.departments.map((dept, i) =>
      i === index ? { ...dept, [name]: value } : dept
    );
    setFormData((prev) => ({ ...prev, departments: updatedDepts }));
  };

  const handleAddDepartment = () => {
    if (formData.departments.every(dept => dept.department && dept.keyOwner)) {
      setFormData((prev) => ({
        ...prev,
        departments: [...prev.departments, { department: "", keyOwner: "" }],
      }));
    }
  };

  const handleRemoveDepartment = (index) => {
    if (formData.departments.length > 1) {
      setFormData((prev) => ({
        ...prev,
        departments: prev.departments.filter((_, i) => i !== index),
      }));
    }
  };

  // Compliance reference handlers
  const handleAddComplianceRef = () => {
    if (formData.complianceReferences.every(ref => ref.compliance && ref.controlNo)) {
      setFormData((prev) => ({
        ...prev,
        complianceReferences: [
          ...prev.complianceReferences,
          { compliance: "", controlNo: "", controlName: "" },
        ],
      }));
      setNewPlus(formData.complianceReferences.length);
    }
  };

  const handleRemoveComplianceRef = (idx) => {
    if (formData.complianceReferences.length > 1) {
      setFormData((prev) => ({
        ...prev,
        complianceReferences: prev.complianceReferences.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleComplianceRefChange = async (idx, field, value, selectedOption) => {
    const updatedRefs = formData.complianceReferences.map((ref, i) =>
      i === idx
        ? {
            ...ref,
            [field]: value,
            ...(field === "compliance" && selectedOption
              ? {
                  controlNo: selectedOption.value.controlRef || "",
                  controlName: selectedOption.value.controlName || "",
                }
              : {}),
          }
        : ref
    );

    setFormData((prev) => ({ ...prev, complianceReferences: updatedRefs }));
  };

  // Form submission
  const handleSubmit = async (e) => {

    console.log("Handle Submit Called !",formData);
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    const validationErrors = [];
    
    if (!formData.category) {
      validationErrors.push("Please select a category");
    }

    if (formData.complianceReferences.length === 0) {
      validationErrors.push("At least one compliance reference is required");
    } else if (formData.complianceReferences.some(ref => !ref.compliance || !ref.controlNo)) {
      validationErrors.push("Please fill all compliance reference fields");
    }

    if (formData.departments.some(dept => !dept.department || !dept.keyOwner)) {
      validationErrors.push("Please fill all department fields");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      setIsSubmitting(false);
      return;
    }
    try {
      const url = id 
        ? `http://localhost:3000/api/controls/${id}`
        : "http://localhost:3000/api/controls";
      
      const method = id ? "put" : "post";
      
      await axios[method](url, formData);
      onSuccess();
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Failed to save control. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="control-form-container">
      <div className="control-form">
        <h1 className="form-header">
          {id ? "Edit Control" : "Create Control"}
        </h1>

        {error && <div className="error-message">{error}</div>}

        <section className="form-section">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Control Name</label>
            <input
              className="form-control"
              type="text"
              name="controlName"
              value={formData.controlName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Audit Objective Summary</label>
            <textarea
              className="form-control"
              name="auditObjectiveSummary"
              value={formData.auditObjectiveSummary}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <section className="form-section">
          <RiskAndFrequencyRow form={formData} onChange={handleChange} />
        </section>

        <section className="form-section">
          <DepartmentSection
            departments={formData.departments}
            allDepartments={departments}
            onAdd={handleAddDepartment}
            onRemove={handleRemoveDepartment}
            onChange={handleDepartmentChange}
          />
        </section>

        <section className="form-section">
          <DynamicArrayField
            values={formData.keyEvidenceToBeVerified}
            name="keyEvidenceToBeVerified"
            label="Key Evidence to be Verified"
            onAdd={() => handleAddArrayField("keyEvidenceToBeVerified")}
            onRemove={(idx) =>
              handleRemoveArrayField("keyEvidenceToBeVerified", idx)
            }
            onChange={(e, idx) =>
              handleArrayChange(e, "keyEvidenceToBeVerified", idx)
            }
            required
          />
        </section>

        <section className="form-section">
          <ComplianceReferenceSection
            id={id}
            complianceReferences={formData.complianceReferences}
            newPlus={newPlus}
            onAdd={handleAddComplianceRef}
            onRemove={handleRemoveComplianceRef}
            onChange={handleComplianceRefChange}
            required
          />
        </section>

        <section className="form-section">
          <DynamicArrayField
            values={formData.evidenceAttached}
            name="evidenceAttached"
            label="Evidence Attached"
            onAdd={() => handleAddArrayField("evidenceAttached")}
            onRemove={(idx) => handleRemoveArrayField("evidenceAttached", idx)}
            onChange={(e, idx) => handleArrayChange(e, "evidenceAttached", idx)}
            required={false}
          />
        </section>

        <section className="form-section">
          <div className="form-group">
            <label className="form-label">Auditor Comment</label>
            <input
              className="form-control"
              type="text"
              name="auditorComment"
              value={formData.auditorComment}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting
              ? "Processing..."
              : id
              ? "Update Control"
              : "Save Control"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlForm;