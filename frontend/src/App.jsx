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
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-all duration-300">
        <Header />
        <main className="mt-[50px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/texttosign" element={<TextToSign />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
