// AdminCoach.js
import React, { useState, useEffect } from 'react';

const AdminCoach = () => {
  const [roomUrl, setRoomUrl] = useState('');
  useEffect(() => {
    const savedRoomUrl = localStorage.getItem('roomUrl');
    if (savedRoomUrl) {
      setRoomUrl(savedRoomUrl); 
    }
  }, []);

  const createMeeting = async () => {
    try {
      const response = await fetch('http://localhost:3000/create-meeting');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRoomUrl(data.roomUrl); 

      localStorage.setItem('roomUrl', data.roomUrl);
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  return (
    <div>
      <h1>Admin Console</h1>
      <button onClick={createMeeting}>Start Meeting</button>

      {roomUrl && (
        <div>
          <p>Meeting URL created! You and customers can now join the meeting.</p>
          <p>Room URL: {roomUrl}</p>
          <button onClick={() => setRoomUrl(roomUrl)}>Join Meeting</button>
        </div>
      )}

      {roomUrl && (
        <iframe
          src={roomUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
          style={{ width: '100%', height: '500px', border: '0', marginTop: '20px' }}
          title="Whereby Meeting"
        ></iframe>
      )}
    </div>
  );
};

export default AdminCoach;
