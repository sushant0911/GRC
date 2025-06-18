import React from 'react';
import ChartCard from './ChartCard';

const complianceData = {
  labels: ['Compliant', 'Non-Compliant', 'In Progress'],
  datasets: [
    {
      label: 'Compliance',
      data: [60, 25, 15],
      backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
    },
  ],
};

const complianceOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Compliance Status Overview',
    },
  },
};

const riskData = {
  labels: ['Low', 'Medium', 'High'],
  datasets: [
    {
      label: 'Risk Levels',
      data: [40, 35, 25],
      backgroundColor: ['#2196f3', '#ffc107', '#f44336'],
    },
  ],
};

const riskOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Risk Level Distribution',
    },
  },
};

const ChartsGrid = () => {
  return (
    <div className="charts-grid fade-in">
      <ChartCard
        title="Compliance Status Overview"
        chartData={complianceData}
        chartOptions={complianceOptions}
      />
      <ChartCard
        title="Risk Level Distribution"
        chartData={riskData}
        chartOptions={riskOptions}
      />
    </div>
  );
};

export default ChartsGrid;
