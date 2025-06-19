import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import SearchSelect from "../components/SearchSelect/SearchSelect";
import Sidebar from "../components/Sidebar/Sidebar";
import "./CreateControlPage.css";

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
      compliance: "", // one of ['ISO', 'CICRA', 'CIBIL']
      controlNo: "",
      controlName: "",
    },
  ],
  // selectedRefNumber: "",

  evidenceAttached: [""],

  auditorComment: "",
};

const riskLevels = ["low", "medium", "high", "critical"];
const auditFrequencies = ["Quarterly", "Half-Yearly", "Yearly"];

const plusIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    style={{ verticalAlign: "middle" }}
  >
    <circle cx="12" cy="12" r="11" fill="#e3e7fd" />
    <path
      d="M12 8v8M8 12h8"
      stroke="#7c6fd1"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const minusIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    style={{ verticalAlign: "middle" }}
  >
    <circle cx="12" cy="12" r="11" fill="#f8d7da" />
    <path d="M8 12h8" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const complianceOptions = [
  { label: "ISO", value: "ISO" },
  { label: "CICRA", value: "CICRA" },
  { label: "CIBIL", value: "CIBIL" },
];

const CreateControlPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [controls, setControls] = useState([]);
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [departments, setDepartments] = useState([]);
  const [compliance, setCompliance] = useState("");
  const [editCompliance,setEditCompliance]=useState(-1);
  const [newPlus, setNewPlus] = useState(-1);
  console.log(form);

  // Fetch categories for the select field
  useEffect(() => {
    axios.get("/api/control-categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  // fetch Department
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(
          "https://beatsdemo.squareyards.com/api/Zing/GetDepartment",
          {
            headers: {
              API_KEY:
                "uAqGJ6bvNqcqsxh4TXMRHP596adeEMLVomMZywp1U0VHUeHLwHxv5jbe5Aw8=",
            },
          }
        );
        setDepartments(res.data.Data);
      } catch (err) {
        console.error("Department fetching error:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch control for edit
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/controls/${id}`).then((res) => {
        const data = res.data;
        setForm({ ...data });
        setLoading(false);
      });
    }
  }, [id]);

  const mapControlOption = (ctrl, compliance) => {
    let ref = "";
    if (compliance === "ISO") ref = ctrl.isoControlRef;
    else if (compliance === "CIBIL") ref = ctrl.cibilRef;
    else if (compliance === "CICRA") ref = ctrl.cicraRef;

    return {
      label: ctrl.controlName, // search by this
      value: ctrl, // store full object
      refValue: ref, // for easy access
    };
  };

  const controlOptions = controls
    .map((ctrl) => mapControlOption(ctrl, compliance))
    .filter((opt) => opt.refValue); // optional safety

  // for adding new compliance-------------

  const handleAddComplianceRef = () => {
    
    const last = form.complianceReferences[form.complianceReferences.length - 1];
    if (last.compliance && last.controlNo) {
      setForm({
        ...form,
        complianceReferences: [
          ...form.complianceReferences,
          { compliance: "", controlNo: "" },
        ],
      });
    }
  };

  const handleRemoveComplianceRef = (idx) => {
    const updated = [...form.complianceReferences];
    updated.splice(idx, 1);
    setForm({ ...form, complianceReferences: updated });
  };

  const handleComplianceRefChange = async (
    idx,
    field,
    value,
    selectedOption
  ) => {
    const updated = [...form.complianceReferences];
    updated[idx][field] = value;

    if (field === "compliance") {
      selectedOption &&
        (updated[idx].controlNo = selectedOption.refValue || "");
      selectedOption && (updated[idx].controlName = selectedOption.label || "");

      const normalized = value.toUpperCase();
      const endpoint =
        normalized === "ISO"
          ? "/api/compliance-iso"
          : normalized === "CIBIL"
          ? "/api/compliance-cibil"
          : normalized === "CICRA"
          ? "/api/compliance-cicra"
          : "";

      if (endpoint) {
        try {
          const res = await axios.get(endpoint);
          setControls(res.data);
        } catch (err) {
          console.error("Error fetching controls:", err);
        }
      }
    }

    setForm({ ...form, complianceReferences: updated });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //----------------

  const handleArrayChange = (e, field, idx) => {
    const arr = [...form[field]];
    arr[idx] = e.target.value;
    setForm({ ...form, [field]: arr });
  };

  const handleAddArrayField = (field) => {
    if (form[field][form[field].length - 1].trim() !== "") {
      setForm({ ...form, [field]: [...form[field], ""] });
    }
  };

  const handleRemoveArrayField = (field, idx) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  // CSV Upload Handler
  // const handleCSVUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   Papa.parse(file, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: async (results) => {
  //       try {
  //         await axios.post("http://localhost:3000/api/controls/bulk", {
  //           controls: results.data,
  //         });
  //         alert("CSV uploaded and data added!");
  //         navigate("/controls");
  //       } catch (err) {
  //         alert("Error uploading CSV");
  //       }
  //     },
  //   });
  // };

  // for adding new department
  const handleDepartmentChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDepartments = [...form.departments];
    updatedDepartments[index][name] = value;
    setForm({ ...form, departments: updatedDepartments });
  };

  const handleAddDepartment = () => {
    setForm({
      ...form,
      departments: [...form.departments, { department: "", keyOwner: "" }],
    });
  };

  const handleRemoveDepartment = (index) => {
    const updatedDepartments = [...form.departments];
    updatedDepartments.splice(index, 1);
    setForm({
      ...form,
      departments: updatedDepartments,
    });
  };
  // ---------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (
      !form.category ||
      !form.complianceReferences.length ||
      form.complianceReferences.some(
        (ref) => !ref.compliance || !ref.controlNo
      ) ||
      !form.departments.length ||
      !form.keyEvidenceToBeVerified.length
    ) {
      alert("Please fill all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/controls/${id}`, form);
      } else {
        await axios.post("http://localhost:3000/api/controls", form);
      }
      navigate("/controls");
    } catch (err) {
      alert(err.response?.data?.error || "Error saving control");
      console.error(err.response ? err.response.data : err.message);
    }
    setSubmitting(false);
  };
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "32px 24px",
          minWidth: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form className="create-control-form" onSubmit={handleSubmit}>
          <h1 style={{ marginBottom: "10px", color: "#4e4e4e" }}>
            Create Control
          </h1>
          {/* CSV Upload */}
          {/* <div style={{ margin: "10px 0" }}>
            <label style={{ fontWeight: 600, color: "#7c6fd1" }}>
              Upload CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              style={{ marginTop: "4px" }}
            />
          </div> */}

          {/* Category Name - technical, people */}
          <label style={{ marginTop: 22 }}>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={{ marginTop: 6, color: "grey" }}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          {/* Control Name */}
          <label style={{ marginTop: 22 }}>Control Name</label>
          <input
            type="text"
            name="controlName"
            value={form.controlName}
            onChange={handleChange}
            required
          />

          {/* Audit Objective Summary */}
          <label>Audit Objective Summary</label>
          <textarea
            name="auditObjectiveSummary"
            value={form.auditObjectiveSummary}
            onChange={handleChange}
            required
          />

          {/* Risk Level and Audit Frequency in one line */}
          <div className="create-control-row">
            <div style={{ flex: 1 }}>
              <label>Risk Level</label>
              <select
                name="riskLevel"
                value={form.riskLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {riskLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Audit Frequency</label>
              <select
                name="auditFrequency"
                value={form.auditFrequency}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {auditFrequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department - Key Owner ✅ */}
          <div className="departments-wrapper">
            <label className="section-title">Departments and Key Owners</label>
            {form.departments.map((dept, idx) => (
              <div className="department-row" key={idx}>
                <div style={{ flex: 1 }}>
                  <label>Department</label>
                  <select
                    name="department"
                    value={dept.department}
                    onChange={(e) => handleDepartmentChange(e, idx)}
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments && departments.length > 0 ? (
                      departments.map((d) => (
                        <option
                          key={d.DepartmentID || d.DeptId}
                          value={d.DepartmentName || ""}
                        >
                          {d.name || d.DepartmentName || "Unnamed Department"}
                          {d.controlCount
                            ? ` (${d.controlCount} controls)`
                            : ""}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading or no departments found</option>
                    )}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label>Key Owner</label>
                  <input
                    type="text"
                    name="keyOwner"
                    placeholder="Key Owner"
                    value={dept.keyOwner}
                    onChange={(e) => handleDepartmentChange(e, idx)}
                    required
                  />
                </div>

                <div className="button-group">
                  {idx === form.departments.length - 1 && (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleAddDepartment}
                      title="Add Department"
                    >
                      {plusIcon}
                    </button>
                  )}
                  {form.departments.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveDepartment(idx)}
                      title="Remove Department"
                    >
                      {minusIcon}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Key Evidence To Be Verified */}
          <label>Key Evidence to be Verified</label>
          {form.keyEvidenceToBeVerified?.map((val, idx) => (
            <div className="create-control-array-field" key={idx}>
              <input
                type="text"
                name="keyEvidenceToBeVerified"
                value={val}
                onChange={(e) =>
                  handleArrayChange(e, "keyEvidenceToBeVerified", idx)
                }
                required
              />
              {idx === form.keyEvidenceToBeVerified.length - 1 && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => handleAddArrayField("keyEvidenceToBeVerified")}
                  title="Add"
                >
                  {plusIcon}
                </button>
              )}
              {form.keyEvidenceToBeVerified.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    handleRemoveArrayField("keyEvidenceToBeVerified", idx)
                  }
                  title="Remove"
                >
                  {minusIcon}
                </button>
              )}
            </div>
          ))}

          {/* Compliance and Reference number */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            <label>Compliance & Reference Number</label>
          </div>

          {form.complianceReferences.map((pair, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div
                className="create-control-array-field"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <select
                  name="compliance"
                  value={pair.compliance}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    handleComplianceRefChange(idx, "compliance", selectedValue);
                    setCompliance(selectedValue);
                  }}
                  required
                  style={{ width: "50%" }}
                >
                  <option value="">-- Compliance --</option>
                  {complianceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {!id || editCompliance === idx  || idx === newPlus ? (
                  <SearchSelect
                    name="control"
                    options={controlOptions}
                    value={pair}
                    onChange={(selectedOption) => {
                      handleComplianceRefChange(
                        idx,
                        "compliance",
                        form.complianceReferences[idx].compliance,
                        selectedOption
                      );
                    }}
                    getCompareKey={(val) =>
                      compliance === "ISO"
                        ? val?.isoControlRef
                        : compliance === "CIBIL"
                        ? val?.cibilRef
                        : compliance === "CICRA"
                        ? val?.cicraRef
                        : ""
                    }
                  />
                ) : (
                  <>
                    <p>{pair.controlName}</p>
                    <button
                      type="button"
                      onClick={() => (
                        setEditCompliance(idx),
                        handleComplianceRefChange(
                          idx,
                          "compliance",
                          pair.compliance
                        ),
                        setCompliance(pair.compliance)
                      )}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>

              {/* Plus and Minus icons in the next line */}
              <div style={{ marginTop: 8 }}>
                {idx === form.complianceReferences.length - 1 && (
                  <button type="button" onClick={()=>(handleAddComplianceRef(),setNewPlus(idx+1))}>
                    {plusIcon}
                  </button>
                )}
                {form.complianceReferences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveComplianceRef(idx)}
                  >
                    {minusIcon}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Evidence Attached */}
          <label>Evidence Attached</label>
          {form.evidenceAttached.map((val, idx) => (
            <div className="create-control-array-field" key={idx}>
              <input
                type="text"
                name="evidenceAttached"
                value={val}
                onChange={(e) => handleArrayChange(e, "evidenceAttached", idx)}
              />
              {idx === form.evidenceAttached.length - 1 && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => handleAddArrayField("evidenceAttached")}
                  title="Add"
                >
                  {plusIcon}
                </button>
              )}
              {form.evidenceAttached.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    handleRemoveArrayField("evidenceAttached", idx)
                  }
                  title="Remove"
                >
                  {minusIcon}
                </button>
              )}
            </div>
          ))}
          {/* Auditor Comment */}
          <label>Auditor Comment</label>
          <input
            type="text"
            name="auditorComment"
            value={form.auditorComment}
            onChange={handleChange}
          />
          <button type="submit" disabled={submitting}>
            {id ? "Update Control" : "Save Control"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateControlPage;
