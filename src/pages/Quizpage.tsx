import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import questions from '../questions.json';
import { Questions } from '../types';
import QuestionComp from '../components/Question';
import StatBar from '../components/statbar';
import AnswerList from '../Answers.json'
import { ErrorBoundary } from '../components/ErrorBoundary';

import {
  currentQuestionIdxAtom,
  correctAnswersAtom,
  incorrectAnswersAtom,
  gameModeAtom,
  quizStartedAtom,
  homePageVisibleAtom,
  resetQuizAtom,
  resultsAtom,
  globalStartDate
} from '../atoms';

import styles from '../App.module.scss';
import Answer_module from '../components/Answer.module.scss';
import question_module from '../components/Question.module.scss';
import Classnames from 'classnames';

// Eagerly preload all videos so they're ready when needed
const videoMap = import.meta.glob('../assets/videos/*.mp4', { eager: true });

// gets and sets the date based off the question day value
function getDateFromDayOffset(offset: number): string {
  const baseDate = new Date(globalStartDate);
  const resultDate = new Date(baseDate.getTime() + (offset * 24 * 60 * 60 * 1000));
  
  return resultDate.toLocaleDateString('en-US', { 
    timeZone: 'America/Chicago',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Get current day index based on Central Time Zone
function getCurrentDayIndex(): number {
  try {
    const now = new Date();
    const baseDate = new Date(globalStartDate);
    
    // Convert both to Central Time and set to midnight for comparison
    const centralNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    centralNow.setHours(0, 0, 0, 0);
    
    const centralBaseDate = new Date(baseDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    centralBaseDate.setHours(0, 0, 0, 0);
    
    const diffTime = centralNow.getTime() - centralBaseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays-1);
  } catch (error) {
    console.error('Error in getCurrentDayIndex:', error);
    return 0;
  }
}

function Quizpage() {
  const navigate = useNavigate();
  const { dayId } = useParams();

  // Global state (Jotai atoms)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useAtom(currentQuestionIdxAtom);
  const [correctAnswers, setCorrectAnswers] = useAtom(correctAnswersAtom);
  const [incorrectAnswers, setIncorrectAnswers] = useAtom(incorrectAnswersAtom);
  const [gameMode] = useAtom(gameModeAtom);
  const [startQuiz] = useAtom(quizStartedAtom);
  const [showHomePage] = useAtom(homePageVisibleAtom);
  const [, resetQuiz] = useAtom(resetQuizAtom);
  const [, setResults] = useAtom(resultsAtom);

  // Local state (specific to this component's lifecycle)
  const [waitingToAdvance, setWaitingToAdvance] = useState(false);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [playFullVideo, setPlayFullVideo] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [shouldEndAfterNext, setShouldEndAfterNext] = useState(false);
  const [autoReplay, setAutoReplay] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Use the URL param as the source of truth for Archive mode
  const archiveDayFromUrl = gameMode === 'Archive' && /^\d+$/.test(dayId || '')
    ? parseInt(dayId!)
    : null;
  
  const videoRef = useRef<HTMLVideoElement>(null);

  //Reset quiz state when gameMode or archive day changes
  useEffect(() => {
    setResults([]);
    setCurrentQuestionIdx(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
  }, [gameMode, dayId]);

  // Calculate based on the day based in for daily
  const getFilteredQuestions = () => {
    const currentDayIndex = getCurrentDayIndex();
    
    if (gameMode === 'Daily') {
      return (questions as Questions).questions.filter(q => q.day === currentDayIndex);
    } else if (gameMode === 'Endless') {
       return (questions as Questions).questions.filter(q => q.day < currentDayIndex);
    } else if (gameMode === 'Hard') {
      return (questions as Questions).questions.filter(q => q.day === currentDayIndex);
    } else if (gameMode === 'Clean') {
      return (questions as Questions).questions.filter(q => q.day === currentDayIndex && q.isClean);
    } else if (gameMode === 'Archive' && archiveDayFromUrl !== null) {
      return (questions as Questions).questions.filter(q => q.day === archiveDayFromUrl);
    }  
    return [];
  };

  const filteredQuestions = getFilteredQuestions();

  // Derived values
  const isQuizFinished = currentQuestionIdx >= filteredQuestions.length;
  const currentQuestion = filteredQuestions[currentQuestionIdx];

  // gets the quizdate from questions day
  const quizDate = gameMode !== 'Endless'
    ? getDateFromDayOffset(currentQuestion?.day + 1 || 0)
    : undefined;

  const videoSrc = !isQuizFinished && currentQuestion?.video
    ? (videoMap[`../assets/videos/${currentQuestion.video}`] as any)?.default
    : undefined;

  // When an answer is submitted, mark correct/incorrect, and prep to play full video
  const onSubmit = (correct: boolean, timeTaken?: number) => {
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
  
      if (gameMode === 'Endless') {
          setShouldEndAfterNext(true);
      }
    }

    if(timeTaken !== undefined) {
      setQuestionTimes(times => [...times, timeTaken]);
    }

    setHasAnswered(true);
    if (autoReplay) {
      setPlayFullVideo(true);
    } else {
      // In resume mode, just continue playing from current position
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Ignore play interruption errors
        });
      }
    }
    setWaitingToAdvance(true);
  };

  // Advance to next question
  const advance = () => {
    setWaitingToAdvance(false);
    setPlayFullVideo(false);
    setHasPaused(false);
    setHasAnswered(false);  // Reset hasAnswered for new question
  
    if (shouldEndAfterNext) {
      navigate('/results', {
        state: {
          totalQuestions: filteredQuestions.length,
          correctAnswers,
          incorrectAnswers,
        },
      });
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };
  

  // Replay from start time
  const onReplay = () => {
    if (videoRef.current && videoSrc) {
      if (autoReplay) {
        videoRef.current.currentTime = currentQuestion.start;
      }
      videoRef.current.play().catch(() => {
        // Ignore play interruption errors
      });
      setShowReplay(false);
      setPlayDisabled(false);
    }
  };

  // Reset states when question changes
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    setPlayDisabled(false);
    setShowReplay(false);
    setHasAnswered(false);
    setHasPaused(false);
  }, [currentQuestionIdx, isQuizFinished, videoSrc]);

  // Set up video time-based logic (pausing at set time unless watching full video)
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const pauseTime = currentQuestion.pause;
      // Only pause if we haven't answered yet and not in full video mode
      if (!playFullVideo && video.currentTime >= pauseTime && !hasPaused && !hasAnswered) {
        video.pause();
        setPlayDisabled(true);
        setShowReplay(true);
        setHasPaused(true);
      }
    };

    const handleVideoEnded = () => {
      if (autoReplay && !hasAnswered) {
        setShowReplay(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);

    // Initial video setup
    if (autoReplay) {
      video.currentTime = currentQuestion.start;
    }
    video.play().catch(() => {
      // Ignore play interruption errors
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [currentQuestionIdx, playFullVideo, isQuizFinished, videoSrc, hasAnswered]);

  useEffect(() => {
    if (gameMode === 'Archive' && archiveDayFromUrl !== null) {
      const questionExists = (questions as Questions).questions.some(q => q.day === archiveDayFromUrl);
      if (!questionExists) {
        console.log('No questions found for archiveDayFromUrl:', archiveDayFromUrl);
        navigate('/'); // or show an error message instead
      }
    }
  }, [archiveDayFromUrl, gameMode]);
  

  // If full video playback is enabled, restart from the beginning
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    if (playFullVideo && videoRef.current && autoReplay) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Ignore play interruption errors
      });
    }
  }, [playFullVideo, autoReplay]);

  // Redirect to results screen when quiz ends
  useEffect(() => {
    if (isQuizFinished) {
      navigate('/results', {
        state: {
          totalQuestions: filteredQuestions.length,
          correctAnswers,
          incorrectAnswers,
        },
      });
    }
  }, [isQuizFinished]);

  const fallbackUI = (
    <div className={styles.appWrapper}>
      <main className={styles.mainContent}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Something went wrong!</h2>
          <p>We're sorry, but there was an error loading the quiz.</p>
          <button 
            onClick={() => navigate('/')}
            className={styles.errorButton}
          >
            Return to Home
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI}>
      <div className={styles.appWrapper}>
        <main className={styles.mainContent}>
          <>
            <StatBar
              currentQuestion={currentQuestionIdx + 1}
              totalQuestions={filteredQuestions.length}
              correct={correctAnswers}
              incorrect={incorrectAnswers}
              quizDate={quizDate}
              autoReplay={autoReplay}
              onAutoReplayChange={setAutoReplay}
            />
            {videoSrc && (
            <QuestionComp
              question={currentQuestion}
              videoSrc={videoSrc}
              videoRef={videoRef}
              playDisabled={playDisabled}
              showReplay={showReplay}
              onReplay={onReplay}
              onSubmit={onSubmit}
              gameMode={gameMode}
              correctAnsers={AnswerList.answers}
            />)}
            {waitingToAdvance && (
              <button
                onClick={advance}
                className={Classnames(Answer_module.answer, question_module['next-btn'])}
              >
                {currentQuestionIdx === filteredQuestions.length - 1 || shouldEndAfterNext
                  ? 'Show Results'
                  : 'Next Question...'}
              </button>
            )}
          </>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default Quizpage;
