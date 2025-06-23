import "./DynamicArrayField.css";

const plusIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    style={{ verticalAlign: "middle" }}
  >
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
    <path d="M8 12h8" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DynamicArrayField = ({
  values,
  name,
  label,
  onAdd,
  onRemove,
  onChange,
  required = true,
}) => {
  return (
    <div className="dynamic-array-field">
      <label>{label}</label>
      {values.map((val, idx) => (
        <div className="array-field-row" key={idx}>
          <input
            type="text"
            name={name}
            value={val}
            onChange={(e) => onChange(e, idx)}
            required={required}
          />
          <div className="array-field-actions">
            {idx === values.length - 1 && (
              <button
                className="plus-icon"
                onClick={onAdd}
                title="Add"
              >
                {plusIcon}
              </button>
            )}
            {values.length > 1 && (
              <button
                className="minus-icon"
                onClick={() => onRemove(idx)}
                title="Remove"
              >
                {minusIcon}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicArrayField;