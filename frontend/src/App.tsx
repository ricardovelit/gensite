import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CodeGenerator from './components/CodeGenerator';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<CodeGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;