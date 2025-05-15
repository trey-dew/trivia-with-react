import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import questions from '../questions.json';
import { Questions } from '../types';
import QuestionComp from '../components/Question';
import StatBar from '../components/statbar';
import AnswerList from '../Answers.json'

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
  const baseDate = new Date(globalStartDate); // Months are 0-indexed (4 = May, May 8th 2025) CHANGE THIS IF WANT NEW START DATE
  baseDate.setDate(baseDate.getDate() + offset);
  return baseDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Get current day index based on Central Time Zone
function getCurrentDayIndex(): number {
  const now = new Date();
  const centralTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const baseDate = new Date(globalStartDate); // May 8th, 2025
  const diffTime = centralTime.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays); // Ensure we don't return negative days
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
       return (questions as Questions).questions.filter(q => q.day < currentDayIndex); // Only show questions from days that have been played
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
    ? getDateFromDayOffset(currentQuestion?.day || 0)
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
    setPlayFullVideo(true);
    setWaitingToAdvance(true);
  };

  // Advance to next question
  const advance = () => {
    setWaitingToAdvance(false);
    setPlayFullVideo(false);
    setHasPaused(false);
  
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
      videoRef.current.currentTime = currentQuestion.start;
      videoRef.current.play();
      setShowReplay(false);
      setPlayDisabled(false);
    }
  };

  // Set up video time-based logic (pausing at set time unless watching full video)
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play();
    setPlayDisabled(false);
    setShowReplay(false);

    const handleTimeUpdate = () => {
      const pauseTime = currentQuestion.pause;
      if (!playFullVideo && video.currentTime >= pauseTime && !hasPaused) {
        video.pause();
        setPlayDisabled(true);
        setShowReplay(true);
        setHasPaused(true);
      }
    };

    const handleVideoEnded = () => {
      setShowReplay(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [currentQuestionIdx, playFullVideo, isQuizFinished, videoSrc]);

  useEffect(() => {
    if (gameMode === 'Archive' && archiveDayFromUrl !== null) {
      const questionExists = (questions as Questions).questions.some(q => q.day === archiveDayFromUrl);
      if (!questionExists) {
        console.log('No questions found for archiveDayFromUrl:', archiveDayFromUrl);
        navigate('/'); // or show an error message instead
      }
    }
  }, [archiveDayFromUrl, gameMode]);
  

  // Jump to current question's start time whenever video changes
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = currentQuestion.start;
      video.play();
    }
  }, [videoSrc]);

  // If full video playback is enabled, restart from the beginning
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    if (playFullVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [playFullVideo]);

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

  return (
    <div className={styles.appWrapper}>
      <main className={styles.mainContent}>
        <>
          <StatBar
            currentQuestion={currentQuestionIdx + 1}
            totalQuestions={filteredQuestions.length}
            correct={correctAnswers}
            incorrect={incorrectAnswers}
            quizDate={quizDate}
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
  );
}

export default Quizpage;
