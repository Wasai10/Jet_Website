import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "@/pages/Landing/Home"
import Gallery from "@/pages/Gallery/Gallery"
import Login from "@/pages/Login/Login"

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App
