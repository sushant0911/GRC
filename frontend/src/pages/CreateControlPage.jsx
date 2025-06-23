// pages/CreateControlPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import ControlForm from "../components/ControlForm/ControlForm";

const CreateControlPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/controls");
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f7fa'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: '32px 24px',
        minWidth: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ControlForm id={id} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateControlPage;