const ControlsHeader = ({ onCreate }) => {
  return (
    <div className="controls-header">
      <h3>Controls List</h3>
      <button onClick={onCreate} className="create-control-btn">
        + Create Control
      </button>
    </div>
  );
};

export default ControlsHeader;
