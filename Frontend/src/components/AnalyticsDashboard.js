import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";

function AnalyticsDashboard() {
  const { id } = useParams();
  const [topPrograms, setTopPrograms] = useState([]);
  const [topProgramsByType, setTopProgramsByType] = useState([]);
  const [programsByIncome, setProgramsByIncome] = useState([]);
  const [selectedTopProgramType, setSelectedTopProgramType] =
    useState("Programs");
  const [selectedRatingType, setSelectedRatingType] = useState("programs");
  const [ratingData, setRatingData] = useState([]);
  const [forumEngagement, setForumEngagement] = useState(0);

  useEffect(() => {
    fetchTopPrograms();
    fetchTopProgramsByType();
    fetchProgramsByIncome();
    fetchRatingData(selectedRatingType);
    fetchForumEngagement();
  }, [selectedRatingType]);

  const fetchTopPrograms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/top-programs");
      setTopPrograms(response.data);
    } catch (error) {
      console.error("Error fetching top programs:", error);
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

  const fetchForumEngagement = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/engagement/${id}`
      );
      setForumEngagement(response.data.totalEngagement);
    } catch (error) {
      console.error("Error fetching forum engagement data:", error);
    }
  };

  return (
    <div className="analytics-container">
      <h2 className="mb-4">Analytics Dashboard</h2>

      {/* Merged Top Programs & Top Programs by Type */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Top Programs</h5>
            <select
              className="form-select mb-3"
              value={selectedTopProgramType}
              onChange={(e) => setSelectedTopProgramType(e.target.value)}
            >
              <option value="Programs">By Program</option>
              <option value="Program Types">By Program Type</option>
            </select>
            <Bar
              data={{
                labels:
                  selectedTopProgramType === "Programs"
                    ? topPrograms.map((p) => p.ProgramName)
                    : topProgramsByType.map((p) => p.ProgramType),
                datasets: [
                  {
                    label:
                      selectedTopProgramType === "Programs"
                        ? "Total Sign-ups"
                        : "Top Programs by Type",
                    data:
                      selectedTopProgramType === "Programs"
                        ? topPrograms.map((p) => p.TotalSignups)
                        : topProgramsByType.map((p) => p.TotalSignups),
                    backgroundColor:
                      selectedTopProgramType === "Programs"
                        ? "rgba(75, 192, 192, 0.6)"
                        : "rgba(255, 99, 132, 0.6)",
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
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
            <h5>Forum Engagement Today</h5>
            <h3 className="text-center">{forumEngagement}</h3>
          </div>
        </div>

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
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
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
