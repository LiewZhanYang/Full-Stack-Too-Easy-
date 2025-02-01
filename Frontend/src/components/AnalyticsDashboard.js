import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import "../App.css";

function AnalyticsDashboard() {
  const [topPrograms, setTopPrograms] = useState([]);
  const [programsByIncome, setProgramsByIncome] = useState([]);
  const [topProgramsByType, setTopProgramsByType] = useState([]);
  const [selectedRatingType, setSelectedRatingType] = useState("programs");
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    fetchTopPrograms();
    fetchProgramsByIncome();
    fetchTopProgramsByType();
    fetchRatingData(selectedRatingType);
  }, [selectedRatingType]);

  const fetchTopPrograms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/top-programs"
      );
      setTopPrograms(response.data);
    } catch (error) {
      console.error("Error fetching top programs:", error);
    }
  };

  const fetchProgramsByIncome = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/programs-by-income"
      );
      setProgramsByIncome(response.data);
    } catch (error) {
      console.error("Error fetching programs ranked by income:", error);
    }
  };

  const fetchTopProgramsByType = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/top-programs-by-type"
      );
      setTopProgramsByType(response.data);
    } catch (error) {
      console.error("Error fetching top programs by type:", error);
    }
  };

  const fetchRatingData = async (type) => {
    let url = "";
    if (type === "programs")
      url = "http://localhost:8000/insight/average-rating/programs";
    else if (type === "program-types")
      url = "http://localhost:8000/insight/average-rating/program-types";
    else if (type === "each-program")
      url = "http://localhost:8000/insight/average-rating/all-programs";

    try {
      const response = await axios.get(url);
      setRatingData(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatingData([]);
    }
  };

  return (
    <div className="analytics-container">
      <h2 className="mb-4">Analytics Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Top Programs by Type</h5>
            <Bar
              data={{
                labels: topProgramsByType.map((p) => p.ProgramType),
                datasets: [
                  {
                    label: "Top Programs",
                    data: topProgramsByType.map((p) => p.TotalSignups),
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Average Ratings</h5>
            <select
              className="form-select mb-3"
              value={selectedRatingType}
              onChange={(e) => setSelectedRatingType(e.target.value)}
            >
              <option value="programs">By Program</option>
              <option value="program-types">By Program Type</option>
              <option value="each-program">Each Program</option>
            </select>
            <Doughnut
              data={{
                labels: ratingData.map((p) => p.ProgramName || p.ProgramType),
                datasets: [
                  {
                    label: "Average Rating",
                    data: ratingData.map((p) => p.AverageRating),
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Programs Ranked by Income</h5>
            <Bar
              data={{
                labels: programsByIncome.map((p) => p.ProgramName),
                datasets: [
                  {
                    label: "Total Income Earned",
                    data: programsByIncome.map((p) => p.TotalIncome),
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
