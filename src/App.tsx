import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "@/pages/Landing/Home"
import Gallery from "@/pages/Gallery/Gallery"
import Login from "@/pages/Login/Login"
import About from "@/pages/About/About"
import Events from "@/pages/Events/Events"
import Blog from "@/pages/Blog/Blog"
import DefaultLayout from "@/components/Layouts/DefaultLayout"


export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
        <Route path="/gallery" element={<DefaultLayout><Gallery /></DefaultLayout>} />
        <Route path="/login" element={<DefaultLayout><Login /></DefaultLayout>} />
        <Route path="/about" element={<DefaultLayout><About /></DefaultLayout>} />
        <Route path="/events" element={<DefaultLayout><Events /></DefaultLayout>} />
        <Route path="/blog" element={<DefaultLayout><Blog /></DefaultLayout>} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App
