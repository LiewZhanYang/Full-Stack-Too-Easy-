// index.js  
import React from 'react';  
import ReactDOM from 'react-dom/client';  

// Import Bootstrap and its dependencies BEFORE your App import  
import '@popperjs/core/dist/umd/popper.min.js';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import 'bootstrap/dist/js/bootstrap.min.js';  
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';  
import App from './App';  



const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(  
  <React.StrictMode>  
    <App />  
  </React.StrictMode>  
);