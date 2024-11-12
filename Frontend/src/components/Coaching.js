// Coaching.js
import React, { useState, useEffect } from 'react';

const Coaching = () => {
  const [roomUrl, setRoomUrl] = useState('');
  useEffect(() => {
    const savedRoomUrl = localStorage.getItem('roomUrl');
    if (savedRoomUrl) {
      setRoomUrl(savedRoomUrl);
    }
  }, []);

  return (
    <div>
      <h1>Join Meeting</h1>
      <button onClick={() => setRoomUrl(roomUrl)}>Join Meeting</button>
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

export default Coaching;
