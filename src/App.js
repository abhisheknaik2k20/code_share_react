import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { signInAnonymouslyUser } from './firebase';
import HomePage from './components/HomePage';
import TextEditor from './components/TextEditor';

function App() {
  useEffect(() => {
    signInAnonymouslyUser().catch(console.error);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:documentId" element={<TextEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
