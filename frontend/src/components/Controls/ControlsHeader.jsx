const ControlsHeader = ({ onCreate }) => {
  return (
    <div className="controls-header">
      <h2>Controls List</h2>
      <button onClick={onCreate} className="create-control-btn">
        + Create Control
      </button>
    </div>
  );
};

export default ControlsHeader;
