import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Charts = ({ type, data }) => {
  const getChart = () => {
    switch (type) {
      case 'fleetUtilization':
        return <FleetUtilizationChart data={data} />;
      case 'operationalCost':
        return <OperationalCostChart data={data} />;
      case 'tripTrends':
        return <TripTrendsChart data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      {getChart()}
    </div>
  );
};

const FleetUtilizationChart = ({ data }) => {
  const chartData = {
    labels: ['Available', 'On Trip', 'In Shop', 'Retired'],
    datasets: [
      {
        data: [
          data.availableVehicles || 8,
          data.activeVehicles || 24,
          data.vehiclesInMaintenance || 3,
          0
        ],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(52, 211, 153)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8'
        }
      },
      title: {
        display: true,
        text: 'Fleet Utilization Overview',
        color: '#e2e8f0',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

const OperationalCostChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fuel Cost',
        data: [8500, 9200, 7800, 10300, 9600, 11200],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Maintenance Cost',
        data: [3200, 4500, 2800, 5600, 3900, 4800],
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8'
        }
      },
      title: {
        display: true,
        text: 'Operational Cost Trends',
        color: '#e2e8f0',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

const TripTrendsChart = ({ data }) => {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Completed Trips',
        data: [12, 18, 15, 22, 19, 8, 5],
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Dispatched Trips',
        data: [8, 14, 10, 18, 15, 6, 3],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8'
        }
      },
      title: {
        display: true,
        text: 'Weekly Trip Trends',
        color: '#e2e8f0',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Charts;