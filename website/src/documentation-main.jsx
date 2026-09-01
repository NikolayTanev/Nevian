import React from 'react';
import ReactDOM from 'react-dom/client';
import DocumentationPage from './components/DocumentationPage.jsx';
import './index.css';
import './scratch.css';
import './documentation.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DocumentationPage />
  </React.StrictMode>,
);
