import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import "../App.css";

function AnalyticsDashboard() {
  const [programData, setProgramData] = useState([]);
  const [signupData, setSignupData] = useState([]);
  const [topPrograms, setTopPrograms] = useState([]);

  useEffect(() => {
    fetchTopPrograms();
  }, []);

  const fetchTopPrograms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/top-programs"
      );
      setTopPrograms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching top programs:", error);
      setTopPrograms([]);
    }
  };

  const programChartData = {
    labels: topPrograms.map((p) => p.ProgramName),
    datasets: [
      {
        label: "Program Sign-ups",
        data: topPrograms.map((p) => p.TotalSignups || 0),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const donutChartData = {
    labels: topPrograms.map((p) => p.ProgramName),
    datasets: [
      {
        label: "Program Sign-ups",
        data: topPrograms.map((p) => p.TotalSignups || 0),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2 className="mb-4">Analytics Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Top 3 Programs by Sign-ups</h5>
            <Bar data={programChartData} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Program Sign-ups Distribution</h5>
            <Doughnut data={donutChartData} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4>Top 3 Most Popular Programs</h4>
        {topPrograms.length > 0 ? (
          <ul className="list-group">
            {topPrograms.map((program, index) => (
              <li key={index} className="list-group-item">
                {program.ProgramName} - {program.TotalSignups} Sign-ups
              </li>
            ))}
          </ul>
        ) : (
          <p>No popular programs found.</p>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
