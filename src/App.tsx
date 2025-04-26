import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Quizpage from './pages/Quizpage';
import Resultspage from './pages/Resultspage';
import Layout from './components/Layout'
import HowToPlay from './pages/HowToPlay';
import Contact from './pages/ContactPage';
import Archive from './pages/ArchivePage';

// Preload all video files in the assets folder
const videoMap = import.meta.glob('./assets/videos/*.mp4', { eager: true });

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path="daily" element={<Quizpage />} />
                    <Route path="results" element={<Resultspage />} />
                    <Route path="howtoplay" element={<HowToPlay />} />
                    <Route path="endless" element={<Quizpage />} />
                    <Route path="hard" element={<Quizpage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="archive" element={<Archive />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

