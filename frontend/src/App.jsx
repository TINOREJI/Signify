import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import TextToSign from './pages/TextToSign';
import Login from './pages/Login';
import Signup from './pages/Signin';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Header />
      <main className="mt-[80px] px-4"> {/* Adjust top margin to match your fixed header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/texttosign" element={<TextToSign />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
