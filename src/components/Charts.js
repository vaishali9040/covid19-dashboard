import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const formatNumber = (number) => {
  if (Math.abs(number) < 1000) {
    return number;
  }
  const units = ['K', 'M', 'B'];
  let unitIndex = 0;
  let formattedNumber = number;
  while (Math.abs(formattedNumber) >= 1000 && unitIndex < units.length - 1) {
    formattedNumber /= 1000;
    unitIndex++;
  }
  return formattedNumber.toFixed(1) + units[unitIndex];
};

const Charts = ({ totalCases, totalRecovered, totalDeaths }) => {
    
  // Prepare data for pie chart
  const pieChartData = {
    labels: ['Total Cases', 'Recoveries', 'Deaths'],
    datasets: [
      {
        data: [totalCases, totalRecovered, totalDeaths],
        backgroundColor: ['blue', 'green', 'red'],
      },
    ],
  };

  return (
    <div>
      <div className="info-container">
        <div className="info-box">Total Cases: {formatNumber(totalCases)}</div>
        <div className="info-box">Recoveries: {formatNumber(totalRecovered)}</div>
        <div className="info-box">Deaths: {formatNumber(totalDeaths)}</div>
      </div>
      <div>
        <h2>Pie Chart</h2>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default Charts;
