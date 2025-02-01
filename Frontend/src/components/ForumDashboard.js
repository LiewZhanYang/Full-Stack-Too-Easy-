import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../App.css"; // Ensure the same CSS file as AnalyticsDashboard is imported

const ForumDashboard = () => {
  const [forumTypes, setForumTypes] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [threadData, setThreadData] = useState([]);
  const [topEngagedCustomers, setTopEngagedCustomers] = useState([]);
  const [threadBodies, setThreadBodies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // Default: Highest sentiment first

  useEffect(() => {
    const fetchForumTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/insight/types");
        setForumTypes(response.data);

        // Set default forum to 'Workshops' if available
        const defaultForum = response.data.find(
          (forum) => forum.Topic.toLowerCase() === "workshop"
        );
        if (defaultForum) {
          setSelectedForum(defaultForum.ForumID);
          fetchTopThreads(defaultForum.ForumID);
        }
      } catch (error) {
        console.error("Error fetching forum types:", error);
      }
    };

    fetchForumTypes();
    fetchTopForumEngagement(); // Fetch top-engaged customers
    fetchThreadBodies(sortOrder); // Fetch all thread bodies sorted by sentiment
  }, [sortOrder]);

  const fetchTopThreads = async (forumID) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/insight/top-threads/${forumID}`
      );
      setThreadData(response.data);
    } catch (error) {
      console.error("Error fetching top threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopForumEngagement = async () => {
    setCustomerLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/top-engagement"
      );
      setTopEngagedCustomers(response.data);
    } catch (error) {
      console.error("Error fetching top forum engagement:", error);
    } finally {
      setCustomerLoading(false);
    }
  };

  const fetchThreadBodies = async (order) => {
    setThreadLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/insight/comments?order=${order}`
      );
      setThreadBodies(response.data);
    } catch (error) {
      console.error("Error fetching thread bodies:", error);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleForumChange = (forumID) => {
    setSelectedForum(forumID);
    fetchTopThreads(forumID);
  };

  return (
    <div className="forum-dashboard-container">
      <h2 className="forum-dashboard-title">Forum Dashboard</h2>

      {/* Top Section: Chart and First Table */}
      <div className="forum-dashboard-top-section">
        <div className="forum-dashboard-sentiment-card">
          <h5>General Sentiment</h5>
          <select
            onChange={(e) => handleForumChange(e.target.value)}
            value={selectedForum || ""}
            className="forum-dropdown"
          >
            <option value="" disabled>
              Select a forum type
            </option>
            {forumTypes.map((forum) => (
              <option key={forum.ForumID} value={forum.ForumID}>
                {forum.Topic}
              </option>
            ))}
          </select>
          {loading ? (
            <p>Loading threads...</p>
          ) : threadData.length > 0 ? (
            <div className="forum-sentiment-chart-container">
              <Bar
                data={{
                  labels: threadData.map((thread) => thread.Title),
                  datasets: [
                    {
                      label: "Sentiment Value",
                      data: threadData.map((thread) => thread.SentimentValue),
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
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p>No threads available.</p>
          )}
        </div>

        <div className="forum-dashboard-engagement-card">
          <h5>Top Forum Engagement by Customers</h5>
          {customerLoading ? (
            <p>Loading customer engagement...</p>
          ) : topEngagedCustomers.length > 0 ? (
            <table className="forum-engagement-table">
              <thead>
                <tr>
                  <th className="forum-rank-column">Rank</th>
                  <th className="forum-customer-name-column">Customer Name</th>
                  <th className="forum-threads-created-column">
                    Threads Created
                  </th>
                  <th className="forum-replies-column">Replies</th>
                  <th className="forum-total-engagement-column">
                    Total Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {topEngagedCustomers.map((customer, index) => (
                  <tr key={customer.AccountID}>
                    <td className="forum-rank-column">{index + 1}</td>
                    <td className="forum-customer-name-column">
                      {customer.CustomerName}
                    </td>
                    <td className="forum-threads-created-column">
                      {customer.TotalThreads}
                    </td>
                    <td className="forum-replies-column">
                      {customer.TotalReplies}
                    </td>
                    <td className="forum-total-engagement-column">
                      {customer.TotalEngagement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No customer engagement data available.</p>
          )}
        </div>
      </div>

      {/* Bottom Section: All Threads Table */}
      <div className="forum-dashboard-threads-card">
        <h5>All Threads (Sorted by Sentiment)</h5>
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          className="forum-dropdown"
        >
          <option value="desc">Highest Sentiment First</option>
          <option value="asc">Lowest Sentiment First</option>
        </select>
        <div className="forum-scroll-box">
          {threadLoading ? (
            <p>Loading threads...</p>
          ) : threadBodies.length > 0 ? (
            <table className="forum-engagement-table forum-threads-table">
              <thead>
                <tr>
                  <th className="forum-thread-body-column">Thread Body</th>
                  <th className="forum-sentiment-value-column">
                    Sentiment Value
                  </th>
                  <th className="forum-posted-by-column">Posted By</th>
                  <th className="forum-created-on-column">Created On</th>
                </tr>
              </thead>
              <tbody>
                {threadBodies.map((thread, index) => (
                  <tr key={index}>
                    <td className="forum-thread-body-column">{thread.Body}</td>
                    <td className="forum-sentiment-value-column">
                      {thread.SentimentValue.toFixed(3)}
                    </td>
                    <td className="forum-posted-by-column">
                      {thread.PostedBy}
                    </td>
                    <td className="forum-created-on-column">
                      {new Date(thread.CreatedOn).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No threads available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDashboard;
