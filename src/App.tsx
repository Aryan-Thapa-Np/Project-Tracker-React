
import Header from './componets/header.tsx';
import Hero from './componets/body.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Hero />
          </>
        } />
        <Route path="/home" element={
          <>
            <Header />
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
