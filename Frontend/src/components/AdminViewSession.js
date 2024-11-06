import React from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminViewSession = () => {
  const sessions = [
    { 
      id: 1, 
      date: 'April 4th-7th', 
      time: '10:00-18:00', 
      location: '1 Clarke Quay' 
    }
  ];

  return (
    <Container fluid className="admin-edit-program-page p-4">
      <h2 className="page-title">Public Speaking Workshop - Sessions</h2>
      <hr className="divider-line mb-4" />
      
      <div className="session-container p-3">
        <Table borderless className="session-table mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time (for all days)</th>
              <th>Location</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.date}</td>
                <td>{session.time}</td>
                <td>{session.location}</td>
                <td className="text-end">
                  <Button variant="link" className="action-icon">
                    <FaEdit />
                  </Button>
                  <Button variant="link" className="action-icon">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Button variant="warning" className="create-session-button mt-3">
        Create Session
      </Button>
    </Container>
  );
};

export default AdminViewSession;
