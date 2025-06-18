import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./EditControlPage.css";

const API_URL = "http://localhost:3000/api/controls";

const EditControlPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    controlName: "",
    auditObjectiveSummary: "",
    keyEvidenceToBeVerified: [""],
  });

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          controlName: data.controlName,
          auditObjectiveSummary: data.auditObjectiveSummary,
          keyEvidenceToBeVerified: data.keyEvidenceToBeVerified.length
            ? data.keyEvidenceToBeVerified
            : [""],
        });
      });
  }, [id]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEvidenceChange = (idx, value) => {
    const updatedEvidence = [...form.keyEvidenceToBeVerified];
    updatedEvidence[idx] = value;
    setForm({ ...form, keyEvidenceToBeVerified: updatedEvidence });
  };

  const handleAddEvidence = () => {
    setForm({
      ...form,
      keyEvidenceToBeVerified: [...form.keyEvidenceToBeVerified, ""],
    });
  };

  const handleRemoveEvidence = (idx) => {
    const updatedEvidence = form.keyEvidenceToBeVerified.filter(
      (_, i) => i !== idx
    );
    setForm({ ...form, keyEvidenceToBeVerified: updatedEvidence });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      navigate("/controls");
    }
  };

  return (
    <div className="edit-control-main-layout">
      <Sidebar />
      <div className="edit-control-page">
        <div className="edit-control-container">
          <h2 className="edit-control-title">Edit Control</h2>
          <form className="edit-control-form" onSubmit={handleSubmit}>
            <label htmlFor="controlName">Control Name</label>
            <input
              id="controlName"
              name="controlName"
              placeholder="Control Name"
              value={form.controlName}
              onChange={handleInputChange}
              required
              type="text"
            />

            <label htmlFor="auditObjectiveSummary">Description</label>
            <input
              id="auditObjectiveSummary"
              name="auditObjectiveSummary"
              placeholder="Audit Objective Summary"
              value={form.auditObjectiveSummary}
              onChange={handleInputChange}
              required
              type="text"
            />

            <label className="evidence-label">
              Key Evidence to be Verified
            </label>
            {form.keyEvidenceToBeVerified.map((evidence, idx) => (
              <div className="evidence-input-row" key={idx}>
                <input
                  type="text"
                  value={evidence}
                  onChange={(e) => handleEvidenceChange(idx, e.target.value)}
                  placeholder={`Evidence ${idx + 1}`}
                  required
                />
                {form.keyEvidenceToBeVerified.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEvidence(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-evidence-btn"
              onClick={handleAddEvidence}
            >
              Add Evidence
            </button>
            <button type="submit" className="edit-control-submit-btn">
              Update Control
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditControlPage;
