import React from 'react';  
import Sidebar from './Sidebar';  

function ComponentName() {  
  return (  
    <div className="flex min-h-screen bg-gray-50">  
      <Sidebar />  
      <div className="flex-1 p-8">  
        <h1>ComponentName Page</h1>  
        {/* Component content here */}  
      </div>  
    </div>  
  );  
}  

export default ComponentName;