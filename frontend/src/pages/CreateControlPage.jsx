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
      <ControlForm id={id} onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateControlPage;