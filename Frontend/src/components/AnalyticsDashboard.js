import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
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
    useState("Program Types");
  const [selectedRatingType, setSelectedRatingType] = useState("program-types");
  const [ratingData, setRatingData] = useState([]);
  const [forumEngagement, setForumEngagement] = useState(0);
  const [newSignUps, setNewSignUps] = useState(0);

  useEffect(() => {
    fetchTopProgramsByType();
    fetchProgramsByIncome();
    fetchRatingData(selectedRatingType);
    fetchForumEngagement();
  }, [selectedRatingType]);

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
    if (type === "program-types")
      url = "http://localhost:8000/insight/average-rating/program-types";
    else if (type === "each-program")
      url = "http://localhost:8000/insight/average-rating/all-programs";

    try {
      const response = await axios.get(url);

      if (Array.isArray(response.data)) {
        setRatingData(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setRatingData([]);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatingData([]); // Reset to an empty array on error
    }
  };

  const fetchForumEngagement = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/engagement"
      );

      if (response.data && response.data.TotalEngagement !== undefined) {
        setForumEngagement(response.data.TotalEngagement);
      } else {
        console.error("Unexpected forum engagement response:", response.data);
        setForumEngagement(0);
      }
    } catch (error) {
      console.error("Error fetching forum engagement data:", error);
      setForumEngagement(0);
    }
  };

  useEffect(() => {
    fetchForumEngagement();
  }, []);

  const fetchNewSignUps = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/new-signups"
      );
      setNewSignUps(response.data.newSignUps);
    } catch (error) {
      console.error("Error fetching new sign-ups:", error);
    }
  };

  useEffect(() => {
    fetchNewSignUps();
  }, []);

  return (
    <div className="analytics-container">
      <h2 className="precoaching-title">Analytics Dashboard</h2>

      {/* Top Programs by Type & Ratings */}
      <div className="grid grid-top">
        {/* Top Programs by Type */}
        <div className="card">
          <h5>Top Programs by Type</h5>
          <div className="chart-container">
            <Bar
              data={{
                labels: topProgramsByType.map((p) => p.ProgramType),
                datasets: [
                  {
                    label: "Total Sign-ups",
                    data: topProgramsByType.map((p) => p.TotalSignups),
                    backgroundColor: "#2F455B",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Average Ratings */}
        <div className="card">
          <h5>Average Ratings</h5>
          <select
            className="dropdown"
            value={selectedRatingType}
            onChange={(e) => setSelectedRatingType(e.target.value)}
          >
            <option value="program-types">By Program Type</option>
            <option value="each-program">Each Program</option>
          </select>
          <div className="chart-container">
            <Doughnut
              data={{
                labels: ratingData.map((p) => p.ProgramName || p.ProgramType),
                datasets: [
                  {
                    label: "Average Rating",
                    data: ratingData.map((p) => p.AverageRating),
                    backgroundColor: ["#DCAF27", "#2F455B", "#F5F7FA"],
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Widgets and Programs Ranked by Income */}
      <div className="grid-income">
        {/* Small widgets for Forum Engagement and New Sign-ups */}
        <div>
          <div className="widget">
            <h5>Forum Engagement Today</h5>
            <h3>{forumEngagement}</h3>
          </div>
          <div className="widget" style={{ marginTop: "20px" }}>
            <h5>New Sign-ups Today</h5>
            <h3>{newSignUps}</h3>
          </div>
        </div>

        {/* Programs Ranked by Income */}
        <div className="card">
          <h5>Programs Ranked by Income</h5>
          <div className="chart-container">
            <Bar
              data={{
                labels: programsByIncome.map((p) => p.ProgramName),
                datasets: [
                  {
                    label: "Total Income Earned",
                    data: programsByIncome.map((p) => p.TotalIncome),
                    backgroundColor: "#DCAF27",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
