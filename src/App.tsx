
import { Routes, Route } from 'react-router-dom';
import NotFound from "./pages/NotFound";
import InterpreBot from "./pages/InterpreBot";
import InterpreCoach from "./pages/InterpreCoach";
import Resources from "./pages/Resources";
import About from "./pages/About";
import GetInTouch from "./pages/GetInTouch";
import SignIn from "./pages/SignIn";
import Careers from "./pages/Careers";
import Layout from "./components/Layout";
import Home from "./pages/Home";

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="interprebot" element={<InterpreBot />} />
          <Route path="interprecoach" element={<InterpreCoach />} />
          <Route path="resources" element={<Resources />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<GetInTouch />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
