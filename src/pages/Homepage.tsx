import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import Home from '../components/Home';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import appModule from '../App.module.scss'
import React from 'react';

import {
  gameModeAtom,
  homePageVisibleAtom,
  quizStartedAtom,
  userId,
  hasSubmitted,
} from '../atoms';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };

// Helper function to get Central Time date string
const getCentralTimeDateString = (date: Date = new Date()): string => {
  const centralTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return centralTime.toISOString().split('T')[0];
};

function Homepage() {
  const navigate = useNavigate();
  const [showAlreadyPlayedPopup, setShowAlreadyPlayedPopup] = useState(false);
  const [userIdValue] = useAtom(userId);

  // Global state via Jotai atoms
  const [, setDifficulty] = useAtom(gameModeAtom);
  const [, setShowHomePage] = useAtom(homePageVisibleAtom);
  const [, setStartQuiz] = useAtom(quizStartedAtom);
  const [, setHasSubmitted] = useAtom(hasSubmitted);

  const checkExistingSubmission = async (gameMode: string) => {
    if (gameMode === 'Archive' || gameMode === 'Endless') return false;

    try {
      const today = getCentralTimeDateString();
      const q = query(
        collection(db, 'quizResults'),
        where('dayString', '==', today),
        where('userId', '==', userIdValue),
        where('gameMode', 'in', ['Daily', 'Hard', 'Clean'])  // Only check these specific modes
      );

      const existing = await getDocs(q);
      return !existing.empty;
    } catch (error) {
      console.error('Error checking existing submission:', error);
      return false;
    }
  };

  // Handler when user selects a difficulty and begins the quiz
  const start = async (selectedDifficulty: string) => {
    const hasPlayed = await checkExistingSubmission(selectedDifficulty);
    
    if (hasPlayed) {
      setHasSubmitted(true);
      setShowAlreadyPlayedPopup(true);
      return;
    }

    // Reset hasSubmitted when starting a new quiz
    setHasSubmitted(false);
    setDifficulty(selectedDifficulty);     
    setShowHomePage(false);                
    setStartQuiz(true);
    
    if(selectedDifficulty === 'Archive') {
      navigate('/Archive');
    }
    else if (selectedDifficulty === 'Hard') {                 
      navigate('/hard');             
    }
    else if (selectedDifficulty === 'Endless') {                 
      navigate('/Endless');             
    }
    else {               
      navigate('/daily');             
    }
  };

  // Message to be rendered between logo and buttons
  const alreadyPlayedMessage = showAlreadyPlayedPopup ? (
    <div className={appModule['already-played-message']}>
      <h2>You've already played today!</h2>
      <p>Come back tomorrow for a new challenge.</p>
      <button 
        className={appModule['close-button']}
        onClick={() => setShowAlreadyPlayedPopup(false)} 
      >
        Close
      </button>
    </div>
  ) : null;
  

  return (
    <div className="homepage-container">
      <div className="content-wrapper">
        <Home onPress={start} alreadyPlayedMessage={alreadyPlayedMessage} />
      </div>
    </div>
  );
}

export default Homepage;
