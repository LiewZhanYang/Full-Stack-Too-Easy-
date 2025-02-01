import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, FormControl } from "react-bootstrap";
import axios from "axios";
import "../App.css";

function InsightsDashboard() {
  const [programAttendees, setProgramAttendees] = useState([]);
  const [highestPayingCustomers, setHighestPayingCustomers] = useState([]);
  const [customerDataTable, setCustomerDataTable] = useState([]);
  const [childData, setChildData] = useState({});
  const [editingNotes, setEditingNotes] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [totalSpent, setTotalSpent] = useState([]);

  useEffect(() => {
    fetchProgramAttendees();
    fetchHighestPayingCustomers();
    fetchCustomerDataTable();
    fetchTotalSpent();
  }, []);

  const fetchProgramAttendees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/program-attendees"
      );
      setProgramAttendees(response.data);
    } catch (error) {
      console.error("Error fetching program attendees:", error);
    }
  };

  const fetchHighestPayingCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/total-spent"
      );
      setHighestPayingCustomers(response.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching highest paying customers:", error);
    }
  };

  const fetchCustomerDataTable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/customer-data-table"
      );
      setCustomerDataTable(response.data);
      response.data.forEach((customer) => {
        fetchChildDetails(customer.AccountID);
      });
    } catch (error) {
      console.error("Error fetching customer data table:", error);
    }
  };

  const fetchChildDetails = async (accountID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/children/${accountID}`
      );
      setChildData((prev) => ({ ...prev, [accountID]: response.data }));
    } catch (error) {
      console.error(
        `Error fetching child details for AccountID ${accountID}:`,
        error
      );
    }
  };

  const fetchTotalSpent = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/insight/total-spent"
      );
      setTotalSpent(response.data);
    } catch (error) {
      console.error("Error fetching total amount spent:", error);
    }
  };

  const handleInputChange = (childID, newNotes) => {
    setEditingNotes((prev) => ({ ...prev, [childID]: newNotes }));
  };

  const handleSaveNotes = async (childID) => {
    try {
      await axios.put(`http://localhost:8000/children/notes/${childID}`, {
        notes: editingNotes[childID],
      });
      fetchCustomerDataTable();
      setEditingNotes((prev) => ({ ...prev, [childID]: undefined }));
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const toggleExpandRow = (accountID) => {
    setExpandedRows((prev) => ({
      ...prev,
      [accountID]: !prev[accountID],
    }));
  };

  return (
    <Container fluid className="p-4">
      <h2 className="precoaching-title">Insights Dashboard</h2>

      {/* Program Attendees Table */}
      <div className="card mb-4 p-4 rounded shadow-sm">
        <h5 className="mb-3">All Programs</h5>
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>Program Name and Tier</th>
              <th>Program Type</th>
              <th>Attendees</th>
            </tr>
          </thead>
          <tbody>
            {programAttendees.map((program, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{program.ProgramName} - {program.TierName}</td>
                <td>{program.ProgramType}</td>
                <td>{program.TotalAttendees}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Highest Paying Customers Table */}
      <div className="card mb-4 p-4 rounded shadow-sm">
        <h5 className="mb-3">Top 5 Highest Paying Customers</h5>
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>Customer Name</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {highestPayingCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{customer.CustomerName || "Unknown"}</td>
                <td>${Number(customer.TotalSpent || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Customer Data Table */}
      <div className="card p-4 mb-4 rounded shadow-sm">
        <h5 className="mb-3">Customer Data Table</h5>
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>Customer Name</th>
              <th>Total Spent</th>
              <th>Forum Engagement</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerDataTable.map((customer, index) => (
              <React.Fragment key={customer.AccountID}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{customer.CustomerName || "Unknown"}</td>
                  <td>${Number(customer.PurchaseTotal || 0).toFixed(2)}</td>
                  <td>{customer.ForumEngagement || 0}</td>
                  <td className="text-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleExpandRow(customer.AccountID)}
                    >
                      {expandedRows[customer.AccountID] ? "Collapse" : "Expand"}
                    </Button>
                  </td>
                </tr>

                {/* Child Rows */}
                {expandedRows[customer.AccountID] && (
                  <tr>
                    <td colSpan="5">
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>Child Name</th>
                            <th>Age</th>
                            <th>Strength</th>
                            <th>Special Needs</th>
                            <th>Dietary Restrictions</th>
                            <th>Notes</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(childData[customer.AccountID]) &&
                          childData[customer.AccountID].length > 0 ? (
                            childData[customer.AccountID].map((child) => (
                              <tr key={child.ChildID}>
                                <td>{child.Name}</td>
                                <td>{child.Age}</td>
                                <td>{child.Strength || "None"}</td>
                                <td>{child.SpecialLearningNeeds || "None"}</td>
                                <td>{child.DietaryRestrictions || "None"}</td>
                                <td>
                                  {editingNotes[child.ChildID] !== undefined ? (
                                    <FormControl
                                      type="text"
                                      value={editingNotes[child.ChildID]}
                                      onChange={(e) =>
                                        handleInputChange(
                                          child.ChildID,
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  ) : (
                                    <span>{child.Notes || "No notes"}</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  {editingNotes[child.ChildID] !== undefined ? (
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      className="d-flex align-items-center"
                                      onClick={() =>
                                        handleSaveNotes(child.ChildID)
                                      }
                                    >
                                      Save
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      className="d-flex align-items-center"
                                      onClick={() =>
                                        handleInputChange(
                                          child.ChildID,
                                          child.Notes || ""
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No children available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Success Confirmation Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Notes Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>The notes have been successfully updated.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default InsightsDashboard;
