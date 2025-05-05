import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Quizpage from './pages/Quizpage';
import Resultspage from './pages/Resultspage';
import Layout from './components/Layout';
import HowToPlay from './pages/HowToPlay';
import Contact from './pages/ContactPage';
import Archive from './pages/ArchivePage';
import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';

import {
    userId,
    hasSubmitted,
  } from './atoms';

// Preload all video files in the assets folder
const videoMap = import.meta.glob('./assets/videos/*.mp4', { eager: true });

// Utility function to get or create a UUID for the user
const getOrCreateUserId = (): string => {
  const local = localStorage.getItem('userId');
  const cookie = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];

  if (local && !cookie) document.cookie = `userId=${local}`;
  if (!local && cookie) localStorage.setItem('userId', cookie);

  if (local || cookie) return (local || cookie)!; // Non-null assertion (safe if you're 100% sure)

  const newId = uuidv4();
  localStorage.setItem('userId', newId);
  document.cookie = `userId=${newId}`;
  return newId;
};

function App() {
    const [userIdValue, setUserIdValue] = useAtom(userId);
    const [hasSubmittedToday] = useAtom(hasSubmitted);

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserIdValue(id);
    console.log('User ID:', id); // For testing
    console.log('Has Submitted:', hasSubmittedToday)
  }, []);

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
          <Route path="archive/day/:dayId" element={<Quizpage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
