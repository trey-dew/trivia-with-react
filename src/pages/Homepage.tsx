import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import Home from '../components/Home';

import {
  difficultyAtom,
  homePageVisibleAtom,
  quizStartedAtom,
} from '../atoms';

function Homepage() {
  const navigate = useNavigate();

  // Global state via Jotai atoms
  const [, setDifficulty] = useAtom(difficultyAtom);
  const [, setShowHomePage] = useAtom(homePageVisibleAtom);
  const [, setStartQuiz] = useAtom(quizStartedAtom);

  // Handler when user selects a difficulty and begins the quiz
  const start = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);     
    setShowHomePage(false);                
    setStartQuiz(true);                   
    navigate('/daily');                    
  };

  return (
    <Home onPress={start} />
  );
}

export default Homepage;
