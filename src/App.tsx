import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "@/pages/Landing/Home"
import Gallery from "@/pages/Gallery/Gallery"

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App
