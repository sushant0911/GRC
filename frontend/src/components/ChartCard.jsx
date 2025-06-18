import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartCard = ({ title, chartData, chartOptions }) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ChartCard;
