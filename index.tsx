import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 
// Если index.css лежит в корне проекта, то путь может быть '../index.css'
import 'katex/dist/katex.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
